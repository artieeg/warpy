import { config } from "@media/config";
import { IRoom, Peer } from "@media/models";
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
    router: SFUService.getRouter(),
    peers: {},
    audioLevelObserver: SFUService.getAudioLevelObserver(),
  };
};

export const handleNewRoom: MessageHandler<
  ICreateMediaRoom,
  INewMediaRoomData
> = async (data, respond) => {
  const { roomId, host } = data;

  console.log("role");
  console.log("new room", data);

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

    room.peers[host] = new Peer({
      recvTransport,
    });

    return;
  }

  const [audio, video] = await Promise.all([
    SFUService.createTransport("send", router, host),
    SFUService.createTransport("send", router, host),
  ]);

  const plainTransport = await SFUService.createPlainTransport(router);

  room.peers[host] = new Peer({
    sendTransport: {
      audio,
      video,
    },
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
    sendTransportOptions: {
      video: getOptionsFromTransport(video),
      audio: getOptionsFromTransport(audio),
    },
  });
};