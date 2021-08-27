import { ParticipantDAL, StreamDAL } from "@backend/dal";
import { FeedService } from "..";

export const stopStream = async (user: string): Promise<void> => {
  const stream = await StreamDAL.findByOwnerIdLive(user);

  if (!stream) {
    throw new Error();
  }

  await StreamDAL.stopStream(stream.id);

  await Promise.all([
    ParticipantDAL.deleteParticipantsByStream(stream.id),
    FeedService.removeCandidate(stream.id),
  ]);
};
