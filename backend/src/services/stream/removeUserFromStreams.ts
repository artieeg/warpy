import { ParticipantDAL } from "@backend/dal";
import { BroadcastService, FeedCacheService } from "..";

//TODO: code's too bad over here

export const removeUserFromStreams = async (user: string): Promise<void> => {
  const stream = await ParticipantDAL.getCurrentStreamFor(user);
  const participant = await ParticipantDAL.getById(user);

  if (participant) {
    /*
    await ParticipantDAL.updateOne(user, {
      hasLeftStream: true,
      left_at: new Date(),
    });
    */

    if (stream) {
      await BroadcastService.broadcastParticipantLeft(user, stream);

      //if (participant?.role === "streamer") {
      //await StreamDAL.delete(stream);
      //await ParticipantDAL.allParticipantsLeave(stream);
      //}
    }

    try {
      await ParticipantDAL.deleteParticipant(participant.id);
    } catch (e) {}
  }

  await FeedCacheService.removeServedStreams(user);
};
