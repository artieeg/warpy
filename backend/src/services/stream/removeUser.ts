import { ParticipantDAL, StreamDAL } from "@backend/dal";
import { BroadcastService, FeedCacheService, FeedService } from "..";

export const removeUser = async (user: string): Promise<void> => {
  const stream = await ParticipantDAL.getCurrentStreamFor(user);

  try {
    if (stream) {
      //Stops the stream if the user is host
      try {
        await StreamDAL.stopStream(stream);
      } catch (e) {
        console.error(e);
      }

      BroadcastService.broadcastParticipantLeft(user, stream);
    }

    await Promise.all([
      FeedCacheService.removeServedStreams(user),
      FeedService.removeCandidateByOwner(user),
      ParticipantDAL.deleteParticipant(user),
    ]);
  } catch (e) {
    console.error(e);
  }
};
