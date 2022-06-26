import { IChatMessage } from "@warpy/lib";
import { StoreSlice2 } from "../types";

export interface IChatDispatchers {
  dispatchChatMessages: (messages: IChatMessage[]) => void;
  dispatchChatSendMessage: () => Promise<void>;
  dispatchChatClearMessages: () => void;
}

export const createChatDispatchers: StoreSlice2<IChatDispatchers> = (
  runner,
  { chat }
) => ({
  async dispatchChatSendMessage() {
    await runner.mergeStateUpdate(chat.send());
  },

  async dispatchChatClearMessages() {
    await runner.mergeStateUpdate(chat.clear());
  },

  async dispatchChatMessages(messages) {
    await runner.mergeStateUpdate(chat.prependNewMessages(messages));
  },
});
