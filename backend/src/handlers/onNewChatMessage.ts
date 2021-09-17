import { ChatService } from "@backend/services";
import {
  INewChatMessage,
  ISendMessageResponse,
  MessageHandler,
} from "@warpy/lib";

export const onNewChatMessage: MessageHandler<
  INewChatMessage,
  ISendMessageResponse
> = async (data, respond) => {
  const { user, message } = data;

  try {
    const newChatMessage = await ChatService.broadcastNewMessage(user, message);

    respond({ message: newChatMessage });
  } catch (e) {
    console.error(e);
  }
};
