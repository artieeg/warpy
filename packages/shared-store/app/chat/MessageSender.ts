import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StateUpdate } from "../types";

export interface MessageSender {
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

  async send() {
    const { api, messageInputValue, messages } = this.state.get();

    const { message: newChatMessage } = await api.stream.sendChatMessage(
      messageInputValue
    );

    this.state.update({
      messages: [newChatMessage, ...messages],
      messageInputValue: "",
    });

    return this.state.getStateDiff();
  }
}
