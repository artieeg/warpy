import { MessageService } from "@app/services";
import { Handler } from "@app/types";

export const onRaiseHand: Handler = (_data, context?) => {
  if (!context || !context.user) {
    return;
  }

  MessageService.sendUserRaiseHandEvent(context.user);
};
