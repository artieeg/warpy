import { MessageService } from "@app/services";
import { Handler } from "@app/types";

export const onConnectTransport: Handler = (data, context?) => {
  const user = context?.user;

  if (!user) {
    return;
  }

  const eventData = {
    ...data,
    user,
  };

  MessageService.sendTransportConnect(eventData);
};
