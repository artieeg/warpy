import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onRaiseHand: Handler = async (_data, context?) => {
  if (!context || !context.user) {
    return;
  }

  MessageService.sendBackendMessage("raise-hand", {
    user: context.user,
  });
};
