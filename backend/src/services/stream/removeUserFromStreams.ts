import { ParticipantDAL } from "@backend/dal";
import { BroadcastService, FeedCacheService } from "..";

export const removeUserFromStreams = async (user: string): Promise<void> => {
  const stream = await ParticipantDAL.getCurrentStreamFor(user);

  try {
    if (stream) {
      BroadcastService.broadcastParticipantLeft(user, stream);
    }

    await ParticipantDAL.deleteParticipant(user);
    await FeedCacheService.removeServedStreams(user);
  } catch (e) {
    console.error(e);
  }
};
