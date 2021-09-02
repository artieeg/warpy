import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onReaction: Handler = async (data, context) => {
  if (!context || !context.user) {
    return;
  }

  MessageService.sendBackendMessage("reaction", {
    stream: data.stream,
    emoji: data.emoji,
    user: context.user,
  });
};
