import { MessageService } from "@app/services";
import { Handler } from "@app/types";

export const onAllowSpeaker: Handler = (data, context?) => {
  if (!context || !context.user) {
    return;
  }

  const { speaker } = data;
  const user = context!.user;

  const payload = {
    user,
    speaker,
  };

  MessageService.sendSpeakerAllowEvent(payload);
};
