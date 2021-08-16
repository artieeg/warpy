import { Handler } from "@ws_gateway/types";
import { MessageService } from "@ws_gateway/services";

export const onUserDelete: Handler = async (_, context, rid) => {
  const user = context.user;

  console.log("deleting", user);

  const response = await MessageService.sendBackendRequest("delete-user", {
    user,
  });

  context.ws.send(
    JSON.stringify({
      event: "@api/response",
      data: response,
      rid,
    })
  );
};
