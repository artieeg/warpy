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

  if (!stream) {
    return;
  }

  await Promise.all([
    FeedsCacheService.removeServedStreams(user),
    FeedService.removeCandidateByOwner(user),
    ParticipantService.removeParticipant(user, stream),
    ParticipantService.broadcastParticipantLeft(user, stream),
  ]);
};
