import { Stream } from "@backend/models";
import {
  FeedsCacheService,
  FeedService,
  ParticipantService,
} from "@backend/services";
import { MessageHandler, IUserDisconnected } from "@warpy/lib";

export const onUserDisconnect: MessageHandler<IUserDisconnected> = async (
  data
) => {
  const { user } = data;

  const stream = await ParticipantService.getCurrentStreamFor(user);

  await Promise.all([
    FeedsCacheService.removeServedStreams(user),
    FeedService.removeCandidateByOwner(user),
    ParticipantService.removeParticipant(user),
    Stream.stopStream(user),
  ]);

  if (stream) {
    await ParticipantService.broadcastParticipantLeft(user, stream);
  }
};
