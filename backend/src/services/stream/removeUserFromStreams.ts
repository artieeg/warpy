import { ParticipantDAL, StreamDAL } from "@backend/dal";
import { BroadcastService, FeedCacheService } from "..";

export const removeUserFromStreams = async (user: string): Promise<void> => {
  const stream = await ParticipantDAL.getCurrentStreamFor(user);

  try {
    await ParticipantDAL.updateOne(user, {
      hasLeftStream: true,
    });

    if (stream) {
      BroadcastService.broadcastParticipantLeft(user, stream);
      await StreamDAL.delete(stream);
    }

    await FeedCacheService.removeServedStreams(user);
  } catch (e) {
    console.error(e);
  }
};
