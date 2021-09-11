import { Peer } from "@media/models";
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

  room.peers[speaker] = new Peer({
    sendTransport: {
      audio: audioTransport,
      video: null,
    },
  });

  respond!({
    routerRtpCapabilities: room.router.rtpCapabilities,
    sendTransportOptions: {
      audio: getOptionsFromTransport(audioTransport),
    },
  });
};
