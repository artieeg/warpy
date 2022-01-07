import { config } from "@media/config";
import { createNewPeer, IRoom } from "@media/models";
import { role } from "@media/role";
import { SFUService } from "@media/services";
import { getOptionsFromTransport } from "@media/utils";
import {
  MessageHandler,
  ICreateMediaRoom,
  INewMediaRoomData,
} from "@warpy/lib";
import { rooms } from "../rooms";

const createNewRoom = (): IRoom => {
  return {
    forwardingToNodeIds: [],
    router:
      role === "PRODUCER"
        ? SFUService.mediaNodeTransferWorker.router
        : SFUService.getWorker().router,
    peers: {},
    audioLevelObserver: SFUService.getAudioLevelObserver(),
  };
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

  const { router } = room;

  if (role === "CONSUMER") {
    const recvTransport = await SFUService.createTransport(
      "recv",
      router,
      host
    );

    room.peers[host] = createNewPeer({
      recvTransport,
    });

    return;
  }

  const [sendTransport, plainTransport] = await Promise.all([
    SFUService.createTransport("send", router, host),
    SFUService.createPlainTransport(router),
  ]);

  room.peers[host] = createNewPeer({
    sendTransport,
    plainTransport,
  });

  const remoteRtpPort = SFUService.getPortForRemoteRTP();
  await plainTransport.connect({
    ip: config.mediasoup.plainRtpTransport.listenIp.ip,
    port: remoteRtpPort,
  });

  plainTransport.appData.remoteRtpPort = remoteRtpPort;

  respond!({
    routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
    sendTransportOptions: getOptionsFromTransport(sendTransport),
  });
};
