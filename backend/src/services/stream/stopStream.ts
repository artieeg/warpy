import { Stream } from "@backend/models";
import { ParticipantService, FeedService } from "..";

export const stopStream = async (user: string) => {
  const stream = await Stream.findOne({ owner: user });

  if (!stream) {
    throw new Error();
  }

  await stream.stop();

  await Promise.all([
    ParticipantService.removeAllParticipants(stream.id),
    FeedService.removeCandidate(stream.id),
  ]);
};
