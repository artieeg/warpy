import { IClap, MessageHandler } from "@warpy/lib";
import { RateLimit, StreamService } from "@backend/services";

export const onClap: MessageHandler<IClap> = async (data): Promise<void> => {
  await RateLimit.withRateLimit(
    StreamService.countNewClap(data.user, data.stream),
    {
      prefix: "claps",
      user: data.user,
      delay: 1000,
      limit: 50,
    }
  );
};
