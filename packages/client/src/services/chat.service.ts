import { ChatMessage } from "@warpy/lib";
import { Service } from "../Service";

export interface ChatData {
  messageInputValue: string;
  messages: ChatMessage[];
}

export class ChatService extends Service<ChatData> {
  async send() {
    const { api, messageInputValue, messages } = this.get();

    const { message: newChatMessage } = await api.stream.sendChatMessage(
      messageInputValue
    );

    return this.set({
      messages: [newChatMessage, ...messages],
      messageInputValue: "",
    });
  }

  getInitialState() {
    return {
      messageInputValue: "",
      messages: [],
    };
  }

  setMessageInput(messageInputValue: string) {
    return this.set({
      messageInputValue,
    });
  }

  async clear() {
    return this.set({
      messages: [],
    });
  }

  async prependNewMessages(messages: ChatMessage[]) {
    return this.set((state) => {
      state.messages = [...messages, ...state.messages];
    });
  }
}
