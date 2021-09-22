import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onUserBlock: Handler = async (data, context, rid) => {
  const user = context.user;

  const response = await MessageService.sendBackendRequest("block-user", {
    user,
    userToBlock: data.userToBlock,
  });

  context.ws.send(
    JSON.stringify({
      event: "@api/response",
      data: response,
      rid,
    })
  );
};
