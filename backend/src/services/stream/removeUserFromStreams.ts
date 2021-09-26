import { ParticipantDAL, StreamDAL } from "@backend/dal";
import { BroadcastService, FeedCacheService } from "..";

//TODO: code's too bad over here

export const removeUserFromStreams = async (user: string): Promise<void> => {
  const stream = await ParticipantDAL.getCurrentStreamFor(user);
  const participant = await ParticipantDAL.getById(user);

  if (participant) {
    await ParticipantDAL.updateOne(user, {
      hasLeftStream: true,
      left_at: new Date(),
    });

    if (stream) {
      BroadcastService.broadcastParticipantLeft(user, stream);

      if (participant?.role === "streamer") {
        await StreamDAL.stop(stream);
        await ParticipantDAL.allParticipantsLeave(stream);
      }
    }
  }

  await FeedCacheService.removeServedStreams(user);
};
