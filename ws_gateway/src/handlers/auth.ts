import { customEventHandlers } from "@ws_gateway/customEventHandlers";
import { customRequestHandlers } from "@ws_gateway/customRequestHandlers";
import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";
import { jwt } from "@ws_gateway/utils";

export const onAuth: Handler = async (data, context, rid) => {
  const { token } = data;
  const { user, isBot } = jwt.verifyAccessToken(token);

  context.user = user;
  context.isBot = isBot;

  const [_req_sub, listenRequest] = MessageService.subscribeForRequests(
    user,
    async (message: any) => {
      const { request, data } = message;
      const customRequestHandler = customRequestHandlers[request];

      if (customRequestHandler) {
        return customRequestHandler(context, data);
      }
    }
  );

  const [_sub, listenEvent] = MessageService.subscribeForEvents(
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

  if (!isBot) {
    const response = await MessageService.sendBackendRequest(
      "user.whoami-request",
      {
        id: Math.random().toString(),
        user,
      }
    );

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
  }

  listenRequest();
  listenEvent();
};
