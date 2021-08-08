import { MessageHandler, IStopStream } from "@warpy/lib";
import { ParticipantService, FeedService } from "@backend/services";
import { Stream } from "@backend/models";

export const onStreamStop: MessageHandler<IStopStream> = async (data) => {
  const { stream, user } = data;

  try {
    await Stream.stopStream(user);

    await Promise.all([
      ParticipantService.removeAllParticipants(stream),
      FeedService.removeCandidate(stream),
    ]);
  } catch (e) {
    console.error(e);

    return;
  }
};
