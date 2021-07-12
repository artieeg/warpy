import { ICreateNewRoom, IRoom, Rooms } from "@app/models";
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
    payload: {
      roomId,
      peerId: host,
      routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
      recvTransportOptions: VideoService.getOptionsFromTransport(recvTransport),
      sendTransportOptions: VideoService.getOptionsFromTransport(sendTransport),
    },
  });
};
