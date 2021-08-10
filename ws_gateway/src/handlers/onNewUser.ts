import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onNewUser: Handler = async (data, context, rid) => {
  const response = await MessageService.sendBackendRequest("new-user", data);

  context.ws.send(
    JSON.stringify({
      event: "@api/response",
      data: response,
      rid,
    })
  );
};
