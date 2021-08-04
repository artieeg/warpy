import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onAllowSpeaker: Handler = async (data, context?) => {
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
