import { createNewPeer } from "@media/models";
import { role } from "@media/role";
import { SFUService } from "@media/services";
import { getOptionsFromTransport } from "@media/utils";
import { RequestJoinMediaRoom } from "@warpy/lib";
import { rooms } from "../rooms";

export const handleJoinRoom = async (
  data: RequestJoinMediaRoom,
  respond: any
) => {
  console.log(role, "handling new user join");

  const { roomId, user } = data;

  const room = rooms[roomId];

  if (!room) {
    return;
  }

  if (role === "CONSUMER") {
    const { router } = SFUService.getWorker();

    const recvTransport = await SFUService.createTransport(
      "recv",
      router,
      user
    );

    const peer = createNewPeer({ recvTransport, router });
    room.peers[user] = peer;

    respond({
      roomId,
      user,
      routerRtpCapabilities: router.rtpCapabilities,
      recvTransportOptions: getOptionsFromTransport(recvTransport),
    });
  }
};
