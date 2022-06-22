import { IChatMessage } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { MessageManager, MessageManagerImpl } from "./MessageManager";
import { MessageSender, MessageSenderImpl } from "./MessageSender";

export class ChatService implements MessageSender, MessageManager {
  private sender: MessageSender;
  private manager: MessageManager;

  constructor(state: IStore | AppState) {
    this.sender = new MessageSenderImpl(state);
    this.manager = new MessageManagerImpl(state);
  }

  async send() {
    return this.sender.send();
  }

  async clear() {
    return this.manager.clear();
  }

  async prependNewMessages(messages: IChatMessage[]) {
    return this.manager.prependNewMessages(messages);
  }
}
