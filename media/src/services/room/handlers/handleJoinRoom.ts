import { Peer } from "@media/models";
import { role } from "@media/role";
import { SFUService } from "@media/services";
import { getOptionsFromTransport } from "@media/utils";
import { IJoinMediaRoom } from "@warpy/lib";
import { rooms } from "../rooms";

export const handleJoinRoom = async (data: IJoinMediaRoom, respond: any) => {
  console.log(role, "handling new user join");

  const { roomId, user } = data;

  const room = rooms[roomId];

  if (!room) {
    return;
  }

  if (role === "CONSUMER") {
    const { router } = room;
    const recvTransport = await SFUService.createTransport(
      "recv",
      router,
      user
    );

    const plainTransport = await SFUService.createPlainTransport(router);

    const peer = new Peer({ recvTransport, plainTransport });
    room.peers[user] = peer;

    respond({
      roomId,
      user,
      routerRtpCapabilities: router.rtpCapabilities,
      recvTransportOptions: getOptionsFromTransport(recvTransport),
    });
  }
};
