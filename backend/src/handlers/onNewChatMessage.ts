import { ChatService } from "@backend/services";
import { INewChatMessage, MessageHandler } from "@warpy/lib";

export const onNewChatMessage: MessageHandler<INewChatMessage> = async (
  data
) => {
  const { user, message } = data;

  try {
    ChatService.broadcastNewMessage(user, message);
  } catch (e) {
    console.error(e);
  }
};
