import { IChatMessage } from "@warpy/lib";
import { StoreDispatcherSlice } from "../types";

export interface IChatDispatchers {
  dispatchChatMessages: (messages: IChatMessage[]) => void;
  dispatchChatSendMessage: () => Promise<void>;
  dispatchChatSetMessage: (msg: string) => void;
  dispatchChatClearMessages: () => void;
}

export const createChatDispatchers: StoreDispatcherSlice<IChatDispatchers> = (
  runner,
  { chat }
) => ({
  dispatchChatSetMessage(msg) {
    runner.mergeStateUpdate(chat.setMessageInput(msg));
  },

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
