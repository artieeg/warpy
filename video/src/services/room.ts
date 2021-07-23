import { IConnectTransport, IRoom, Rooms } from "@video/models";
import { Producer } from "mediasoup/lib/Producer";
import { MessageService, VideoService } from ".";
import {
  createConsumer,
  createTransport,
  getOptionsFromTransport,
} from "./video";
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
import { role } from "@video/role";

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
      console.log("creating consumer params");
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
  console.log(room);

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
  console.log(room.peers);

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

  console.log("connecting transport");
  console.log(data);
  const room = rooms[roomId];

  if (!room) {
    return; //TODO;;; send error
  }

  const peer = room.peers[user];
  const transport =
    direction === "send" ? peer.sendTransport : peer.recvTransport;

  console.log("server role", role);
  console.log("peer", peer);

  if (!transport) {
    return;
  }

  try {
    await transport.connect({ dtlsParameters });
  } catch (e) {
    console.log("e", e, e.message);
    //TODO
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

  console.log("producing", kind, rtpParameters);
  let newProducer: Producer;
  try {
    newProducer = await transport.produce({
      kind,
      rtpParameters,
      appData: { ...appData, user, transportId },
    });

    const pipeConsumer = await VideoService.createPipeConsumer(newProducer.id);

    MessageService.sendNewProducer({
      userId: user,
      roomId,
      id: pipeConsumer.id,
      kind: pipeConsumer.kind,
      rtpParameters: pipeConsumer.rtpParameters,
      rtpCapabilities: rtpCapabilities,
      appData: pipeConsumer.appData,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
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
  const { ip, port, srtp } = data;

  const localPipeTransport = await VideoService.createPipeTransport(0);
  await localPipeTransport.connect({ ip, port, srtpParameters: srtp });

  //const { remoteIp, remotePort } = localPipeTransport.tuple;
  const { localIp, localPort } = localPipeTransport.tuple;
  const { srtpParameters } = localPipeTransport;

  console.log("INGRESS PIPE TRANSPORT TUPLE");
  console.log(localPipeTransport.tuple);

  VideoService.pipeToEgress = localPipeTransport;

  respond!({
    ip: localIp!,
    port: localPort!,
    //ip: remoteIp!,
    //port: remotePort!,
    srtp: srtpParameters,
  });
};

export const tryConnectToIngress = async () => {
  const transport = await VideoService.createPipeTransport(0);

  VideoService.pipeToIngress = transport;

  const remoteParams = await MessageService.tryConnectToIngress({
    ip: transport.tuple.localIp,
    port: transport.tuple.localPort,
    srtp: transport.srtpParameters,
  });

  const { ip, port, srtp } = remoteParams;

  await transport.connect({ ip, port, srtpParameters: srtp });
};

export const handleNewProducer = async (data: INewProducer) => {
  console.log("received i new producer event", data);
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

    if (pipeProducer.closed) {
      process.exit(1);
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
