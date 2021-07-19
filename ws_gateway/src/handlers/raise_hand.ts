import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onRaiseHand: Handler = (_data, context?) => {
  if (!context || !context.user) {
    return;
  }

  console.log("sending raise hand event");

  MessageService.sendUserRaiseHandEvent(context.user);
};
