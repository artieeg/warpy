import { IAllowSpeakerPayload, MessageHandler } from "@warpy/lib";
import { StreamService } from "@backend/services";

export const onAllowSpeaker: MessageHandler<IAllowSpeakerPayload> = async (
  data
) => {
  const { speaker, user } = data;

  await StreamService.allowSpeaker(speaker, user);
};
