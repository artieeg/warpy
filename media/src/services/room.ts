import { IConnectTransport, IRoom, Rooms } from "@media/models";
import { NodeInfo } from "@media/nodeinfo";
import { role } from "@media/role";
import {
  IConnectMediaServer,
  IConnectNewSpeakerMedia,
  ICreateMediaRoom,
  IJoinMediaRoom,
  INewMediaRoomData,
  INewMediaTrack,
  INewProducer,
  INewSpeakerMediaResponse,
  IRecvTracksRequest,
  IRecvTracksResponse,
  MessageHandler,
} from "@warpy/lib";
import { Producer } from "mediasoup/lib/Producer";
import util from "util";
import { MessageService, VideoService } from ".";
import {
  createConsumer,
  createTransport,
  getOptionsFromTransport,
} from "./video";

const rooms: Rooms = {};

const createNewRoom = (): IRoom => {
  return {
    router: VideoService.getRouter(),
    peers: {},
  };
};

export const handleNewSpeaker: MessageHandler<
  IConnectNewSpeakerMedia,
  INewSpeakerMediaResponse
> = async (data, respond) => {
  const { roomId, speaker } = data;

  const room = rooms[roomId];

  if (!room) {
    return;
  }

  const peer = room.peers[speaker];
  peer.sendTransport?.close();

  const transport = await createTransport("send", room.router, speaker);
  peer.sendTransport = transport;

  const sendTransportOptions = getOptionsFromTransport(transport);

  respond!({
    rtpCapabilities: room.router.rtpCapabilities,
    sendTransportOptions,
  });
};

export const handleRecvTracksRequest: MessageHandler<
  IRecvTracksRequest,
  IRecvTracksResponse
> = async (data, respond) => {
  const { roomId, user, rtpCapabilities } = data;

  const room = rooms[roomId];

  if (!room) {
    return;
  }

  const { router, peers } = room;

  const peer = peers[user];

  if (!peer) {
    return;
  }

  const transport = peer.recvTransport;

  if (!transport) {
    return;
  }

  const consumerParams = [];

  for (const peerId of Object.keys(peers)) {
    const peer = peers[peerId];

    if (!peer || peerId == user || !peer.producer) {
      continue;
    }

    try {
      const { producer } = peer;
      consumerParams.push(
        await createConsumer(
          router,
          producer,
          rtpCapabilities,
          transport,
          user,
          peers[peerId]
        )
      );
    } catch (e) {
      continue;
    }
  }

  respond!({
    consumerParams,
  });
};

export const handleJoinRoom = async (data: IJoinMediaRoom) => {
  console.log(role, "handling new user join");

  const { roomId, user } = data;

  const room = rooms[roomId];

  if (!room) {
    return;
  }

  const peer = room.peers[user];
  const { router } = room;

  const recvTransport = await createTransport("recv", router, user);

  if (peer) {
    peer.recvTransport = recvTransport;
  } else {
    room.peers[user] = {
      recvTransport,
      consumers: [],
      producer: null,
      sendTransport: null, //todo this
    };
  }

  if (role === "CONSUMER") {
    MessageService.sendMessageToUser(user, {
      event: "@media/recv-connect-params",
      data: {
        roomId,
        user,
        routerRtpCapabilities: router.rtpCapabilities,
        recvTransportOptions: getOptionsFromTransport(recvTransport),
      },
    });
  }
};

export const handleNewRoom: MessageHandler<
  ICreateMediaRoom,
  INewMediaRoomData
> = async (data, respond) => {
  const { roomId, host } = data;

  if (rooms[roomId]) {
    return;
  }

  const room = createNewRoom();
  rooms[roomId] = room;

  if (role === "CONSUMER") {
    const recvTransport = await createTransport("recv", room.router, host);

    room.peers[host] = {
      recvTransport,
      sendTransport: null,
      consumers: [],
      producer: null,
    };

    return;
  }

  const sendTransport = await createTransport("send", room.router, host);

  /*
  const [sendTransport, recvTransport] = await Promise.all([
    createTransport("send", room.router, host),
    createTransport("recv", room.router, host),
  ]);
  */

  room.peers[host] = {
    recvTransport: null,
    sendTransport,
    consumers: [],
    producer: null,
  };

  respond!({
    routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
    //recvTransportOptions: VideoService.getOptionsFromTransport(recvTransport),
    sendTransportOptions: VideoService.getOptionsFromTransport(sendTransport),
  });
};

export const handleConnectTransport = async (data: IConnectTransport) => {
  const { roomId, user, dtlsParameters, direction } = data;

  const room = rooms[roomId];

  if (!room) {
    return; //TODO;;; send error
  }

  const peer = room.peers[user];
  const transport =
    direction === "send" ? peer.sendTransport : peer.recvTransport;

  if (!transport) {
    return;
  }

  try {
    await transport.connect({ dtlsParameters });
  } catch (e) {
    console.log("e", e, e.message);
    return;
  }

  MessageService.sendMessageToUser(user, {
    event: `@media/${direction}-transport-connected`,
    data: {
      roomId,
    },
  });
};

export const handleNewTrack = async (data: INewMediaTrack) => {
  const {
    roomId,
    user,
    direction,
    kind,
    rtpParameters,
    rtpCapabilities,
    appData,
    transportId,
  } = data;

  const room = rooms[roomId];
  /*  */
  if (!room) {
    return; //TODO: Send error
  }

  const { peers } = room;

  const peer = peers[user];
  const { sendTransport: transport, producer, consumers } = peer;

  if (!transport) {
    return; //TODO: Send error
  }

  //TODO: Close previous producer if there's one

  let resultId = null;

  let newProducer: Producer;
  try {
    console.log("trying to produce", kind);
    newProducer = await transport.produce({
      kind,
      rtpParameters,
      appData: { ...appData, user, transportId },
    });
    console.log("producing", kind);

    const pipeConsumers = await VideoService.createPipeConsumers(
      newProducer.id
    );

    console.log("created pipe consumers");

    for (const [node, pipeConsumer] of Object.entries(pipeConsumers)) {
      console.log("sending new producer of", pipeConsumer.kind, "to", node);
      MessageService.sendNewProducer(node, {
        userId: user,
        roomId,
        id: pipeConsumer.id,
        kind: pipeConsumer.kind,
        rtpParameters: pipeConsumer.rtpParameters,
        rtpCapabilities: rtpCapabilities,
        appData: pipeConsumer.appData,
      });
    }
  } catch (e) {
    console.error("error:", e);
    console.error("error:", e.message);
    return;
  }

  peer.producer = newProducer;
  resultId = newProducer.id;

  MessageService.sendMessageToUser(user, {
    event: `@media/${direction}-track-created`,
    data: {
      id: resultId,
    },
  });
};

export const handleNewEgress: MessageHandler<
  IConnectMediaServer,
  IConnectMediaServer
> = async (data, respond) => {
  const { ip, port, srtp, node } = data;

  const localPipeTransport = await VideoService.createPipeTransport(0);
  await localPipeTransport.connect({ ip, port, srtpParameters: srtp });

  //const { remoteIp, remotePort } = localPipeTransport.tuple;
  const { localIp, localPort } = localPipeTransport.tuple;
  const { srtpParameters } = localPipeTransport;

  console.log("INGRESS PIPE TRANSPORT TUPLE");
  console.log(localPipeTransport.tuple);

  VideoService.egressPipes[node] = localPipeTransport;

  console.log("current pipes");
  console.log(util.inspect(VideoService.egressPipes, { depth: 0 }));

  respond!({
    node: NodeInfo.id,
    ip: localIp!,
    port: localPort!,
    //ip: remoteIp!,
    //port: remotePort!,
    srtp: srtpParameters,
  });
};

export const handleNewProducer = async (data: INewProducer) => {
  console.log("received new producer event");
  const { userId, roomId, rtpCapabilities } = data;

  const pipeProducer = await VideoService.pipeToIngress.produce({
    id: data.id,
    kind: data.kind,
    rtpParameters: data.rtpParameters,
    appData: data.appData,
  });

  let room = rooms[roomId];

  if (!room) {
    room = {
      router: VideoService.getPipeRouter(),
      peers: {},
    };
    rooms[roomId] = room;
  }

  const { peers } = room;

  if (!peers[userId]) {
    const recvTransport = await createTransport(
      "recv",
      VideoService.getPipeRouter(),
      userId
    );

    peers[userId] = {
      sendTransport: null,
      recvTransport,
      producer: pipeProducer,
      consumers: [],
    };
  } else {
    peers[userId].producer = pipeProducer;
  }

  for (const peerId in peers) {
    if (peerId === userId) {
      continue;
    }

    const peerRecvTransport = peers[peerId].recvTransport;

    if (!peerRecvTransport) {
      continue;
    }

    try {
      const { consumerParameters } = await createConsumer(
        room.router,
        pipeProducer,
        //VideoService.getPipeRouter().rtpCapabilities,
        rtpCapabilities,
        peerRecvTransport,
        userId,
        peers[peerId]
      );

      //console.log("sneding consumer params", consumerParameters);
      MessageService.sendMessageToUser(peerId, {
        event: "@media/new-track",
        data: {
          user: userId,
          consumerParameters,
          roomId,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
};