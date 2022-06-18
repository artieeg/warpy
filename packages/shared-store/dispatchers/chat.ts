import { IChatMessage } from "@warpy/lib";
import { ChatService } from "../app/chat";
import { StoreSlice } from "../types";
import { mergeStateUpdate } from "../utils";

export interface IChatDispatchers {
  dispatchChatMessages: (messages: IChatMessage[]) => void;
  dispatchChatSendMessage: () => Promise<void>;
  dispatchChatClearMessages: () => void;
}

export const createChatDispatchers: StoreSlice<IChatDispatchers> = (
  set,
  get
) => ({
  async dispatchChatSendMessage() {
    set(await mergeStateUpdate(new ChatService(get()).send()));
  },

  async dispatchChatClearMessages() {
    set(await mergeStateUpdate(new ChatService(get()).clear()));
  },

  async dispatchChatMessages(messages) {
    set(
      await mergeStateUpdate(
        new ChatService(get()).prependNewMessages(messages)
      )
    );
  },
});
