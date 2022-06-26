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

    console.log("sending an msg", messageInputValue);

    const { message: newChatMessage } = await api.stream.sendChatMessage(
      messageInputValue
    );
    console.log("msg", newChatMessage);

    this.state.update({
      messages: [newChatMessage, ...messages],
      messageInputValue: "",
    });

    return this.state.getStateDiff();
  }
}
