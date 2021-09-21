import { ParticipantDAL } from "@backend/dal";
import { BroadcastService, FeedCacheService } from "..";

export const removeUserFromStreams = async (user: string): Promise<void> => {
  const stream = await ParticipantDAL.getCurrentStreamFor(user);
  const participant = await ParticipantDAL.getById(user);

  try {
    if (participant) {
      await ParticipantDAL.updateOne(user, {
        hasLeftStream: true,
      });

      if (stream) {
        BroadcastService.broadcastParticipantLeft(user, stream);

        if (participant?.role === "streamer") {
          ParticipantDAL.deleteParticipant(user);
        }
      }
    }

    await FeedCacheService.removeServedStreams(user);
  } catch (e) {
    console.error(e);
  }
};
