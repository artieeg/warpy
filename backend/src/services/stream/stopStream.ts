import { ParticipantDAL, StreamDAL } from "@backend/dal";
import { FeedService } from "..";

export const stopStream = async (user: string) => {
  const stream = await StreamDAL.stopStream(user);

  if (!stream) {
    throw new Error();
  }

  await Promise.all([
    ParticipantDAL.deleteParticipantsByStream(stream),
    FeedService.removeCandidate(stream),
  ]);
};
