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

  await Promise.all([
    FeedsCacheService.removeServedStreams(user),
    FeedService.removeCandidateByOwner(user),
    ParticipantService.broadcastParticipantLeft(user),
  ]);
};
