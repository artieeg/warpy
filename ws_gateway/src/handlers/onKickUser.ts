import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onKickUser: Handler = async (data, context) => {
  const { user } = context;

  if (!user) {
    return;
  }

  MessageService.sendBackendMessage("kick-user", {
    user,
    userToKick: data.userToKick,
  });
};
