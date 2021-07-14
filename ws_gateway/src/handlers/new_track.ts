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

  MessageService.sendNewTrackEvent(eventData);
};
