import { Stream } from "@backend/models";
import { FeedsCacheService, FeedService, ParticipantService } from "..";

export const removeUser = async (user: string) => {
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
