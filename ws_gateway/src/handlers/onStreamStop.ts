import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onStreamStop: Handler = async (data, context) => {
  const user = context?.user;
  const { stream } = data;

  console.log("user", user, "stream", stream);

  if (!user) {
    return;
  }

  const event = {
    user,
    stream,
  };

  MessageService.sendBackendMessage("stream-stop", event);
};
