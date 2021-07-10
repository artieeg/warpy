import { MessageService } from "@app/services";
import { Handler } from "@app/types";

export const onNewTrack: Handler = (data, context?) => {
  const { track } = data;
  const user = context?.user;

  if (!user) {
    return;
  }

  const eventData = {
    track,
    user,
  };

  MessageService.sendNewTrackEvent(eventData);
};
