import { ParticipantDAL } from "@backend/dal";
import { BroadcastService, MediaService, MessageService } from "..";

export const allowSpeaker = async (
  speaker: string,
  host: string
): Promise<void> => {
  const stream = await ParticipantDAL.getCurrentStreamFor(host);

  if (!stream) {
    return;
  }

  const role = await ParticipantDAL.getRoleFor(host, stream);

  if (role !== "streamer") {
    throw new Error();
  }

  const speakerData = await ParticipantDAL.makeSpeaker(speaker);

  if (!speakerData) {
    throw new Error();
  }

  const media = await MediaService.connectSpeakerMedia(speaker, stream);

  const [recvNodeId, sendNodeId] = await Promise.all([
    MediaService.getConsumerNodeId(),
    MediaService.getProducerNodeId(),
  ]);

  const mediaPermissionToken = MediaService.createPermissionsToken({
    user: speaker,
    room: stream,
    video: false,
    audio: true,
    recvNodeId,
    sendNodeId,
  });

  MessageService.sendMessage(speaker, {
    event: "speaking-allowed",
    data: {
      stream,
      media,
      mediaPermissionToken,
    },
  });

  BroadcastService.broadcastNewSpeaker(speakerData);
};
