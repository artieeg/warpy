import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onFeedRequest: Handler = async (_, context) => {
  if (!context) {
    return;
  }

  const user = context.user;

  MessageService.sendBackendMessage("feed-request", {
    user,
  });
};
