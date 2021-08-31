import { ParticipantDAL, UserDAL } from "@backend/dal";
import { BroadcastService, FeedCacheService } from "..";

export const removeUser = async (user: string): Promise<void> => {
  const stream = await ParticipantDAL.getCurrentStreamFor(user);

  try {
    if (stream) {
      BroadcastService.broadcastParticipantLeft(user, stream);
    }

    await Promise.all([
      FeedCacheService.removeServedStreams(user),
      UserDAL.delete(user),
    ]);
  } catch (e) {
    console.error(e);
  }
};
