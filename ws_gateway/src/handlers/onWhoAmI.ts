import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onWhoAmI: Handler = (_, context) => {
  const { user } = context!;

  if (!user) {
    return;
  }

  MessageService.sendBackendMessage("whoami-request", {
    user,
  });
};
