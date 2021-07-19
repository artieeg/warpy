import { MessageService } from "@ws_gateway/services";
import { Context, Handler } from "@ws_gateway/types";

export const onJoinStream: Handler = async (data: any, context?: Context) => {
  const { stream } = data;

  console.log("joining new stream", stream, context!.user);

  MessageService.sendUserJoinEvent({ stream, user: context!.user });
};
