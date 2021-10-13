import { IConnectTransport } from "@media/models";
import { MessageService } from "@media/services";
import { getMediaPermissions } from "@media/utils";
import { rooms } from "../rooms";

export const handleConnectTransport = async (data: IConnectTransport) => {
  const { roomId, user, dtlsParameters, direction, mediaPermissionsToken } =
    data;

  if (direction === "send") {
    const permissions = getMediaPermissions(mediaPermissionsToken);

    console.log("users permissions", permissions);

    if (!permissions.audio && !permissions.video) {
      return;
    }

    /*
    verifyMediaPermissions(mediaPermissionsToken, {
      audio: mediaKind === "audio",
      video: mediaKind === "video",
    });
    */
  }

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
