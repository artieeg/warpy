import { MessageService } from "@app/services";
import { Handler } from "@app/types";

export const onConnectTransport: Handler = (data, context?) => {
  const user = context?.user;
  console.log(`user ${user} connects transport`, data);

  if (!user) {
    return;
  }

  const eventData = {
    ...data,
    user,
  };

  MessageService.sendTransportConnect(eventData);
};
