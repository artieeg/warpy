import { IChatMessage } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { MessageManager, MessageManagerImpl } from "./MessageManager";
import { MessageSender, MessageSenderImpl } from "./MessageSender";
import { Service } from "../Service";

export class ChatService
  extends Service
  implements MessageSender, MessageManager
{
  private sender: MessageSender;
  private manager: MessageManager;

  constructor(state: IStore | AppState) {
    super(state);

    this.sender = new MessageSenderImpl(this.state);
    this.manager = new MessageManagerImpl(this.state);
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
