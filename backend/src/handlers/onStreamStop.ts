import { MessageHandler, IStopStream } from "@warpy/lib";
import { StreamService } from "@backend/services";

export const onStreamStop: MessageHandler<IStopStream> = async (data) => {
  const { user } = data;

  await StreamService.stopStream(user);
};
