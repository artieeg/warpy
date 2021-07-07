import { MessageService } from "@app/services";
import { Handler } from "@app/types";
import { jwt } from "@app/utils";

export const onAuth: Handler = async (data, context) => {
  const { token } = data;
  const user = jwt.verifyAccessToken(token);

  context!.user = user;

  const [sub, listen] = await MessageService.subscribeForEvents(
    user,
    (data: any) => {
      const { event, payload } = data;

      context!.ws.emit(JSON.stringify({ event, payload }));
    }
  );

  context!.sub = sub;

  await listen;
};
