import { IChatMessage } from "@warpy/lib";
import { ChatService } from "../app/chat";
import { StoreSlice } from "../types";
import { runner } from "../useStore";

export interface IChatDispatchers {
  dispatchChatMessages: (messages: IChatMessage[]) => void;
  dispatchChatSendMessage: () => Promise<void>;
  dispatchChatClearMessages: () => void;
}

export const createChatDispatchers: StoreSlice<IChatDispatchers> = (
  _set,
  get
) => ({
  async dispatchChatSendMessage() {
    await runner.mergeStateUpdate(new ChatService(get()).send());
  },

  async dispatchChatClearMessages() {
    await runner.mergeStateUpdate(new ChatService(get()).clear());
  },

  async dispatchChatMessages(messages) {
    await runner.mergeStateUpdate(
      new ChatService(get()).prependNewMessages(messages)
    );
  },
});
