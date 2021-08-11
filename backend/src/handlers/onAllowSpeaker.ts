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

  console.log("allowing speaker", data);
  console.log("stream", stream);
  if (!stream) {
    return;
  }

  const role = await ParticipantService.getRoleFor(user);

  console.log("role", role);
  if (role !== "streamer") {
    return;
  }

  const speakerData = await UserService.getUserById(speaker);

  console.log("data", speakerData);
  if (!speakerData) {
    return;
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
