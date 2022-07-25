import { ChatMessage } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { Service } from "../Service";

export interface ChatData {
  messageInputValue: string;
  messages: ChatMessage[];
}

export class ChatService extends Service<ChatData> {
  constructor(state: IStore | AppState) {
    super(state);
  }

  getInitialState() {
    return {
      messageInputValue: "",
      messages: [],
    };
  }

  setMessageInput(messageInputValue: string) {
    return this.state.update({
      messageInputValue,
    });
  }

  async send() {
    const { api, messageInputValue, messages } = this.state.get();

    const { message: newChatMessage } = await api.stream.sendChatMessage(
      messageInputValue
    );

    return this.state.update({
      messages: [newChatMessage, ...messages],
      messageInputValue: "",
    });
  }

  async clear() {
    return this.state.update({
      messages: [],
    });
  }

  async prependNewMessages(messages: ChatMessage[]) {
    return this.state.update({
      messages: [...messages, ...this.state.get().messages],
    });
  }
}
