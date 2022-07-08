import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StateUpdate } from "../types";

export interface MessageSender {
  setMessageInput: (messageInputValue: string) => StateUpdate;
  send: () => Promise<StateUpdate>;
}

export class MessageSenderImpl implements MessageSender {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
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
}
