import {
  IConnectTransport,
  ICreateNewRoom,
  IJoinRoom,
  INewTrack,
  IRecvTracksRequest,
  IRoom,
  Rooms,
} from "@app/models";
import { Producer } from "mediasoup/lib/Producer";
import { MessageService, VideoService } from ".";
import {
  createConsumer,
  createTransport,
  getOptionsFromTransport,
} from "./video";

const rooms: Rooms = {};

const createNewRoom = (): IRoom => {
  return {
    ...VideoService.getWorker(),
    peers: {},
  };
};

export const handleRecvTracksRequest = async (data: IRecvTracksRequest) => {
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

  MessageService.sendMessageToUser(user, {
    event: "recv-tracks-response",
    data: {
      roomId,
      consumerParams,
    },
  });
};

export const handleJoinRoom = async (data: IJoinRoom) => {
  const { roomId, user } = data;

  const room = rooms[roomId];

  if (!room) {
    return;
  }

  const peer = room.peers[user];
  const { router } = room;

  if (peer) {
    //TODO ?
  }

  const recvTransport = await createTransport("recv", router, user);

  room.peers[user] = {
    recvTransport,
    consumers: [],
    producer: null,
    sendTransport: null,
  };

  MessageService.sendMessageToUser(user, {
    event: "joined-room",
    data: {
      roomId,
      user,
      routerRtpCapabilities: router.rtpCapabilities,
      recvTransportOptions: getOptionsFromTransport(recvTransport),
    },
  });
};

export const handleNewRoom = async (data: ICreateNewRoom) => {
  const { roomId, host } = data;

  if (rooms[roomId]) {
    return;
  }

  const room = createNewRoom();
  rooms[roomId] = room;

  const [sendTransport, recvTransport] = await Promise.all([
    createTransport("send", room.router, host),
    createTransport("recv", room.router, host),
  ]);

  room.peers[host] = {
    recvTransport,
    sendTransport,
    consumers: [],
    producer: null,
  };

  MessageService.sendMessageToUser(host, {
    event: "created-room",
    data: {
      roomId,
      peerId: host,
      routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
      recvTransportOptions: VideoService.getOptionsFromTransport(recvTransport),
      sendTransportOptions: VideoService.getOptionsFromTransport(sendTransport),
    },
  });
};

export const handleConnectTransport = async (data: IConnectTransport) => {
  const { roomId, user, dtlsParameters, direction } = data;

  console.log("data", data);
  console.log("roomid", roomId);

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
    //TODO
    return;
  }

  MessageService.sendMessageToUser(user, {
    event: `${direction}-transport-connected`,
    data: {
      roomId,
    },
  });
};

export const handleNewTrack = async (data: INewTrack) => {
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
    newProducer = await transport.produce({
      kind,
      rtpParameters,
      appData: { ...appData, user, transportId },
    });
  } catch {
    return;
  }

  peer.producer = newProducer;
  resultId = newProducer.id;

  for (const peerId in peers) {
    if (peerId === user) {
      continue;
    }

    const peerRecvTransport = peers[peerId].recvTransport;

    if (!peerRecvTransport) {
      continue;
    }

    try {
      const { consumerParameters } = await createConsumer(
        rooms[roomId].router,
        newProducer,
        rtpCapabilities,
        peerRecvTransport,
        user,
        peers[peerId]
      );

      MessageService.sendMessageToUser(peerId, {
        event: "new-speaker-track",
        data: {
          user,
          consumerParameters,
          roomId,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  console.log("sending ", `${direction}-track-created`, "event");
  MessageService.sendMessageToUser(user, {
    event: `${direction}-track-created`,
    data: {
      id: resultId,
    },
  });
};
