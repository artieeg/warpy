import { createNewPeer } from "@media/models";
import { SFUService } from "@media/services";
import { getOptionsFromTransport } from "@media/utils";
import {
  MessageHandler,
  IConnectNewSpeakerMedia,
  INewSpeakerMediaResponse,
} from "@warpy/lib";
import { rooms } from "../rooms";

export const handleNewSpeaker: MessageHandler<
  IConnectNewSpeakerMedia,
  INewSpeakerMediaResponse
> = async (data, respond) => {
  const { roomId, speaker } = data;

  const room = rooms[roomId];

  if (!room) {
    return;
  }

  const audioTransport = await SFUService.createTransport(
    "send",
    room.router,
    speaker
  );

  room.peers[speaker] = createNewPeer({
    sendTransport: audioTransport,
  });

  respond!({
    routerRtpCapabilities: room.router.rtpCapabilities,
    sendTransportOptions: getOptionsFromTransport(audioTransport),
  });
};
