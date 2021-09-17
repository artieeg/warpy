import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";
import { INewChatMessage } from "@warpy/lib";

export const onNewChatMessage: Handler = async (data, context, rid) => {
  const user = context.user;

  if (!user) {
    return;
  }

  const eventData: INewChatMessage = {
    message: data.message,
    user,
  };

  const response = await MessageService.sendBackendRequest(
    "new-chat-message",
    eventData
  );

  context.ws.send(
    JSON.stringify({
      event: "@api/response",
      data: response,
      rid,
    })
  );
};
