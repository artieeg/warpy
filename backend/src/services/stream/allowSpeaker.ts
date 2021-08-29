import { ParticipantDAL } from "@backend/dal";
import { BroadcastService, MediaService, MessageService } from "..";

export const allowSpeaker = async (
  speaker: string,
  host: string
): Promise<void> => {
  const stream = await ParticipantDAL.getCurrentStreamFor(host);

  if (!stream) {
    throw new Error();
  }

  const role = await ParticipantDAL.getRoleFor(host, stream);

  if (role !== "streamer") {
    throw new Error("This user can't allow speaking");
  }

  const speakerData = await ParticipantDAL.makeSpeaker(speaker);

  if (!speakerData) {
    throw new Error("The speaker does not exist");
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
