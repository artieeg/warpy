import { StreamDAL } from "@backend/dal";
import { ParticipantService, FeedService } from "..";

export const stopStream = async (user: string) => {
  const stream = await StreamDAL.stopStream(user);

  if (!stream) {
    throw new Error();
  }

  await Promise.all([
    ParticipantService.removeAllParticipants(stream),
    FeedService.removeCandidate(stream),
  ]);
};
