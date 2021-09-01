import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onClap: Handler = async (data, context) => {
  if (!context || !context.user) {
    return;
  }

  MessageService.sendBackendMessage("raise-hand", {
    stream: data.stream,
    user: context.user,
  });
};
