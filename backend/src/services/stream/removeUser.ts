import { StreamDAL } from "@backend/dal";
import { FeedsCacheService, FeedService, ParticipantService } from "..";

export const removeUser = async (user: string) => {
  const stream = await ParticipantService.getCurrentStreamFor(user);

  await Promise.all([
    FeedsCacheService.removeServedStreams(user),
    FeedService.removeCandidateByOwner(user),
    ParticipantService.removeParticipant(user),
    StreamDAL.stopStream(user),
  ]);

  if (stream) {
    await ParticipantService.broadcastParticipantLeft(user, stream);
  }
};
