import { MessageService } from "@app/services";
import { Handler } from "@app/types";
import { jwt } from "@app/utils";

export const onAuth: Handler = async (data, context) => {
  const { token } = data;
  const user = jwt.verifyAccessToken(token);

  context!.user = user;

  await MessageService.subscribeForEvents(user, (message: any) => {
    const { event, data } = message;
    context!.ws.send(JSON.stringify({ event, data }));
  });
};
