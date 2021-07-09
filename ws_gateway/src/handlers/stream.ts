import { MessageService } from "@app/services";
import { Context, Handler } from "@app/types";

export const onJoinStream: Handler = async (data: any, context?: Context) => {
  const { stream } = data;

  console.log("joining new stream", stream, context!.user);

  MessageService.sendUserJoinEvent({ stream, id: context!.user });
};
