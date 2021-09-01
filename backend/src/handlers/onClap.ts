import { IClap, MessageHandler } from "@warpy/lib";
import { RateLimit, StreamService } from "@backend/services";

export const onClap: MessageHandler<IClap> = async (data): Promise<void> => {
  const fn = RateLimit.withRateLimit(StreamService.countNewClap, {
    prefix: "claps",
    user: data.user,
    delay: 1000,
    limit: 50,
  });

  fn(data.user, data.stream);
};
