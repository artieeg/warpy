import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";
import { jwt } from "@ws_gateway/utils";

export const onAuth: Handler = async (data, context) => {
  const { token } = data;
  const user = jwt.verifyAccessToken(token);

  context!.user = user;

  console.log("authed new user", user);

  await MessageService.subscribeForEvents(user, (message: any) => {
    const { event, data } = message;
    context!.ws.send(JSON.stringify({ event, data }));
  });
};
