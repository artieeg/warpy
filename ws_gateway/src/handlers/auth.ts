import { customEventHandlers } from "@ws_gateway/customEventHandlers";
import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";
import { jwt } from "@ws_gateway/utils";

export const onAuth: Handler = async (data, context, rid) => {
  const { token } = data;
  const user = jwt.verifyAccessToken(token);

  context.user = user;

  const [_sub, listen] = MessageService.subscribeForEvents(
    user,
    (message: any) => {
      const { event, data } = message;

      const customEventHandler = customEventHandlers[event];

      if (customEventHandler) {
        customEventHandler(context, data);
      } else {
        context.ws.send(JSON.stringify({ event, data }));
      }
    }
  );

  const response = await MessageService.sendBackendRequest(
    "user.whoami-request",
    {
      id: Math.random().toString(),
      user,
    }
  );

  console.log("whoami response", response);

  context.ws.send(
    JSON.stringify({
      rid,
      event: "response",
      data: {
        user: response.user,
        following: response.following,
      },
    })
  );

  listen();
};
