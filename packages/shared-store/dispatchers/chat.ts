import { IChatMessage } from "@warpy/lib";
import produce from "immer";
import { StoreSlice } from "../types";
import { IStore } from "../useStore";

export interface IChatDispatchers {
  dispatchChatMessages: (messages: IChatMessage[]) => void;
  dispatchChatSendMessage: () => Promise<void>;
  dispatchChatClearMessages: () => void;
  dispatchSetChatInput: (msg: string) => void;
}

export const createChatDispatchers: StoreSlice<IChatDispatchers> = (
  set,
  get
) => ({
  async dispatchSetChatInput(msg) {
    set({
      messageInputValue: msg,
    });
  },

  async dispatchChatSendMessage() {
    const { api, messageInputValue } = get();

    const { message: newChatMessage } = await api.stream.sendChatMessage(
      messageInputValue
    );

    set(
      produce<IStore>((state) => {
        state.messages = [newChatMessage, ...state.messages];
        state.messageInputValue = "";
      })
    );
  },

  dispatchChatClearMessages() {
    set({
      messages: [],
    });
  },

  dispatchChatMessages(messages) {
    set(
      produce<IStore>((state) => {
        state.messages = [...messages, ...state.messages];
      })
    );
  },
});
