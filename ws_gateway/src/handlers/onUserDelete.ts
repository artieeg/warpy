import { Handler } from "@ws_gateway/types";
import { MessageService } from "@ws_gateway/services";

export const onUserDelete: Handler = async (_, context, rid) => {
  const user = context.user;

  const response = await MessageService.sendBackendRequest("delete-user", {
    user,
  });

  context.ws.send({
    event: "@api/response",
    data: response,
    rid,
  });
};
