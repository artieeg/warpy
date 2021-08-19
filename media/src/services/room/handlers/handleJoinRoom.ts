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

  const peer = room.peers[user];
  const { router } = room;

  const recvTransport = await SFUService.createTransport("recv", router, user);

  if (peer) {
    peer.recvTransport = recvTransport;
  } else {
    room.peers[user] = new Peer({
      recvTransport,
    });
  }

  if (role === "CONSUMER") {
    respond({
      roomId,
      user,
      routerRtpCapabilities: router.rtpCapabilities,
      recvTransportOptions: getOptionsFromTransport(recvTransport),
    });
  }
};
