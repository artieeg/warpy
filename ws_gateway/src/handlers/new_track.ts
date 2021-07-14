import { MessageService } from "@app/services";
import { Handler } from "@app/types";

export const onNewTrack: Handler = (data, context?) => {
  const user = context?.user;

  if (!user) {
    return;
  }

  const eventData = {
    ...data,
    user,
  };

  console.log("new track event", eventData);

  MessageService.sendNewTrackEvent(eventData);
};
