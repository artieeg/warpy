import { StreamService } from "@backend/services";
import { IRaiseHand, MessageHandler } from "@warpy/lib";

export const onRaiseHand: MessageHandler<IRaiseHand> = async (data) => {
  const { user } = data;
  StreamService.setHandRaise(user, true);
};
