import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onNewStream: Handler = async (data, context) => {
  if (!context) {
    return;
  }

  const user = context!.user;

  const { title, hub } = data;

  MessageService.sendBackendMessage("stream-new", {
    owner: user,
    title,
    hub,
  });
};
