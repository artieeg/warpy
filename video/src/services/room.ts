import {
  IConnectTransport,
  ICreateNewRoom,
  INewTrack,
  IRoom,
  Rooms,
} from "@app/models";
import { MessageService, VideoService } from ".";
import { createTransport } from "./video";

const rooms: Rooms = {};

const createNewRoom = (): IRoom => {
  return {
    ...VideoService.getWorker(),
    peers: {},
  };
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

  const peer = room.peers[user];
  const { sendTransport: transport, producer, consumers } = peer;

  if (!transport) {
    return; //TODO: Send error
  }

  //TODO: Close previous producer if there's one

  let resultId = null;

  try {
    const newProducer = await transport.produce({
      kind,
      rtpParameters,
      appData: { ...appData, user, transportId },
    });

    peer.producer = newProducer;
    resultId = newProducer.id;
  } catch {}

  //TODO: create consumers for each peer

  MessageService.sendMessageToUser(user, {
    event: `${direction}-track-created`,
    data: {
      id: resultId,
    },
  });
};
