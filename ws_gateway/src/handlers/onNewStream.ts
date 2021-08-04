import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onNewStream: Handler = async (data, context, rid) => {
  if (!context) {
    return;
  }

  const user = context!.user;

  const { title, hub } = data;

  const response = await MessageService.sendBackendRequest("stream-new", {
    owner: user,
    title,
    hub,
  });

  context.ws.send(
    JSON.stringify({
      event: "@api/response",
      data: response,
      rid,
    })
  );
};
