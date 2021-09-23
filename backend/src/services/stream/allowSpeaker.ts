import { BlockDAO, ParticipantDAL } from "@backend/dal";
import {
  BlockedByAnotherSpeaker,
  NoPermissionError,
  StreamHasBlockedSpeakerError,
  StreamNotFound,
  UserNotFound,
} from "@backend/errors";
import { BroadcastService, MediaService, MessageService } from "..";

const checkBannedBySpeaker = async (user: string, stream: string) => {
  const speakers = await ParticipantDAL.getSpeakers(stream);
  const blockedByIds = await BlockDAO.getBlockedByIds(user);
  const blockedIds = await BlockDAO.getBlockedUserIds(user);

  const blocker = speakers.find((speaker) => blockedByIds.includes(speaker.id));

  if (blocker) {
    throw new BlockedByAnotherSpeaker({
      last_name: blocker.last_name,
      first_name: blocker.first_name,
    });
  }

  const blockedStreamSpeaker = speakers.find((speaker) =>
    blockedIds.includes(speaker.id)
  );

  if (blockedStreamSpeaker) {
    throw new StreamHasBlockedSpeakerError({
      last_name: blockedStreamSpeaker.last_name,
      first_name: blockedStreamSpeaker.first_name,
    });
  }
};

export const allowSpeaker = async (
  speaker: string,
  host: string
): Promise<void> => {
  const stream = await ParticipantDAL.getCurrentStreamFor(host);

  if (!stream) {
    throw new StreamNotFound();
  }

  const role = await ParticipantDAL.getRoleFor(host, stream);

  if (role !== "streamer") {
    throw new NoPermissionError();
  }

  await checkBannedBySpeaker(speaker, stream);

  const speakerData = await ParticipantDAL.makeSpeaker(speaker);

  if (!speakerData) {
    throw new UserNotFound();
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
