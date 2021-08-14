import { User } from "@backend/models";
import { Participant } from "@warpy/lib";
import { ParticipantService, MediaService, MessageService } from "..";

export const allowSpeaker = async (speaker: string, host: string) => {
  const stream = await ParticipantService.getCurrentStreamFor(host);

  if (!stream) {
    return;
  }

  const role = await ParticipantService.getRoleFor(host);

  if (role !== "streamer") {
    throw new Error();
  }

  const speakerData = await User.findOne(speaker);

  if (!speakerData) {
    throw new Error();
  }

  const media = await MediaService.connectSpeakerMedia(speaker, stream);

  await Promise.all([
    ParticipantService.unsetRaiseHand(speaker),
    ParticipantService.setParticipantRole(stream, speaker, "speaker"),
  ]);

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

  ParticipantService.broadcastNewSpeaker(
    Participant.fromUser(speakerData, "speaker", stream)
  );
};
