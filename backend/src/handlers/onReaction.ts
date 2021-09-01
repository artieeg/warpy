import { IClap, MessageHandler } from "@warpy/lib";
import { RateLimit, StreamService } from "@backend/services";

export const onReaction: MessageHandler<IClap> = async (
  data
): Promise<void> => {
  const fn = RateLimit.withRateLimit(StreamService.countNewClap, {
    prefix: "reactions",
    user: data.user,
    delay: 50 * 300,
    limit: 50,
  });

  fn(data.user, data.stream);
};
