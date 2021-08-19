import { IConnectTransport } from "@media/models";
import { MessageService } from "@media/services";
import { verifyMediaPermissions } from "@media/utils";
import { rooms } from "../rooms";

export const handleConnectTransport = async (data: IConnectTransport) => {
  const {
    roomId,
    user,
    dtlsParameters,
    direction,
    mediaKind,
    mediaPermissionsToken,
  } = data;
  console.log("connect transport request", data);

  if (direction === "send") {
    verifyMediaPermissions(mediaPermissionsToken, {
      audio: mediaKind === "audio",
      video: mediaKind === "video",
    });
  }

  const room = rooms[roomId];

  if (!room) {
    return; //TODO;;; send error
  }

  //Need to specify media kind for "send" transports
  if (!mediaKind && direction === "send") {
    return;
  }

  const peer = room.peers[user];
  const transport =
    direction === "send" ? peer.sendTransport[mediaKind!] : peer.recvTransport;

  if (!transport) {
    return;
  }

  try {
    await transport.connect({ dtlsParameters });
  } catch (e) {
    console.log("e", e, e.message);
    return;
  }

  console.log("connected transport for", user);
  MessageService.sendMessageToUser(user, {
    event: `@media/${direction}-transport-connected`,
    data: {
      roomId,
    },
  });
};
