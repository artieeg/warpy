import { ParticipantDAL, StreamDAL } from "@backend/dal";
import { BroadcastService, FeedsCacheService, FeedService } from "..";

export const removeUser = async (user: string) => {
  const stream = await ParticipantDAL.getCurrentStreamFor(user);

  try {
    if (stream) {
      //Stops the stream if the user is host
      StreamDAL.stopStream(stream);

      BroadcastService.broadcastParticipantLeft(user, stream);
    }

    await Promise.all([
      FeedsCacheService.removeServedStreams(user),
      FeedService.removeCandidateByOwner(user),
      ParticipantDAL.deleteParticipant(user),
    ]);
  } catch (e) {}
};
