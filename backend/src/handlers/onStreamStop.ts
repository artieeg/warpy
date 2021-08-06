import { MessageHandler, IStopStream } from "@warpy/lib";
import { StreamService, ParticipantService } from "@backend/services";

export const onStreamStop: MessageHandler<IStopStream> = async (data) => {
  const { stream, user } = data;

  try {
    await StreamService.stopStream(stream, user);

    await Promise.all([
      ParticipantService.removeAllParticipants(stream),
      FeedService.removeCandidate(stream),
    ]);
  } catch (e) {
    console.error(e);

    return;
  }
};
