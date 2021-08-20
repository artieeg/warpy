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

  const peer = room.peers[speaker];
  if (peer.sendTransport.audio) {
    peer.sendTransport.audio.close();
  }

  const audioTransport = await SFUService.createTransport(
    "send",
    room.router,
    speaker
  );
  peer.sendTransport.audio = audioTransport;

  respond!({
    rtpCapabilities: room.router.rtpCapabilities,
    sendTransportOptions: {
      audio: getOptionsFromTransport(audioTransport),
    },
  });
};
