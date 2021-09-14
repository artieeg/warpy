import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";
import { INewChatMessage } from "@warpy/lib";

export const onNewChatMessage: Handler = async (data, context) => {
  const user = context.user;

  if (!user) {
    return;
  }

  const eventData: INewChatMessage = {
    message: data.message,
    user,
  };

  MessageService.sendBackendMessage("new-chat-message", eventData);
};
