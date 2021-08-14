import { ParticipantDAL, StreamDAL } from "@backend/dal";
import { BroadcastService, FeedsCacheService, FeedService } from "..";

export const removeUser = async (user: string) => {
  const stream = await ParticipantDAL.getCurrentStreamFor(user);

  try {
    await Promise.all([
      FeedsCacheService.removeServedStreams(user),
      FeedService.removeCandidateByOwner(user),
      ParticipantDAL.deleteParticipant(user),
      StreamDAL.stopStream(user),
    ]);
  } catch (e) {}

  if (stream) {
    BroadcastService.broadcastParticipantLeft(user, stream);
  }
};
