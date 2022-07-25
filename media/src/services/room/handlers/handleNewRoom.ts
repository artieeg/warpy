import { createNewPeer, IRoom } from "@media/models";
import { role } from "@media/role";
import { SFUService } from "@media/services";
import { MessageHandler, RequestCreateMediaRoom } from "@warpy/lib";
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

export const handleNewRoom: MessageHandler<RequestCreateMediaRoom, {}> = async (
  data,
  respond
) => {
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

  /*
  const sendTransport = await SFUService.createTransport("send", router, host);

  room.peers[host] = createNewPeer({
    sendTransport,
    //router
  });

  respond!({
    routerRtpCapabilities: rooms[roomId].router.rtpCapabilities,
    sendTransportOptions: getOptionsFromTransport(sendTransport),
  });
  */

  respond!({});
};
