import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onNewTrack: Handler = async (data, context?) => {
  const user = context?.user;

  console.log("user", user);

  if (!user) {
    return;
  }

  const eventData = {
    ...data,
    user,
  };

  console.log("new track", data);
  MessageService.sendBackendMessage("new-track", eventData);
};
