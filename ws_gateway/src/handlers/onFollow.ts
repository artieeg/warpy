import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onFollow: Handler = async (data, context) => {
  const user = context.user;

  if (!user) {
    return;
  }

  const eventData = {
    ...data,
    user,
  };

  MessageService.sendBackendMessage("user-follow", eventData);
};
