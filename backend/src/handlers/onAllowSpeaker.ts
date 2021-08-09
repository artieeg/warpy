import { IAllowSpeakerPayload, MessageHandler, Participant } from "@warpy/lib";
import {
  MediaService,
  MessageService,
  ParticipantService,
  UserService,
} from "@backend/services";

export const onAllowSpeaker: MessageHandler<IAllowSpeakerPayload> = async (
  data
) => {
  const { speaker, user } = data;

  const stream = await ParticipantService.getCurrentStreamFor(user);

  if (!stream) {
    return;
  }

  const role = await ParticipantService.getRoleFor(user, stream);

  if (role !== "streamer") {
    return;
  }

  const speakerData = await UserService.getUserById(speaker);

  if (!speakerData) {
    return;
  }

  const media = await MediaService.connectSpeakerMedia(speaker, stream);

  await Promise.all([
    ParticipantService.unsetRaiseHand(speaker),
    ParticipantService.setParticipantRole(stream, speaker, "speaker"),
  ]);

  MessageService.sendMessage(speaker, {
    event: "speaking-allowed",
    data: {
      stream,
      media,
    },
  });

  ParticipantService.broadcastNewSpeaker(
    Participant.fromUser(speakerData, "speaker", stream)
  );
};
