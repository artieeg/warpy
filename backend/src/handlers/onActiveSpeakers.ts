import { StreamService } from "@backend/services";
import { IActiveSpeakersPayload, MessageHandler } from "@warpy/lib";

export const onActiveSpeakers: MessageHandler<IActiveSpeakersPayload> = async (
  data
) => {
  const { speakers } = data;

  StreamService.updateActiveSpeakers(speakers);
};
