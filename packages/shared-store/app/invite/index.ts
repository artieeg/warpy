import { InviteStates } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { InviteCleaner, InviteCleanerImpl } from "./InviteCleaner";
import { InviteSender, InviteSenderImpl } from "./InviteSender";
import {
  ReceivedInviteManager,
  ReceivedInviteManagerImpl,
} from "./ReceivedInviteManager";
import { SentInviteStateUpdater } from "./SentInviteStateUpdater";

export class InviteService
  implements
    InviteCleaner,
    InviteSender,
    ReceivedInviteManager,
    SentInviteStateUpdater
{
  private cleaner: InviteCleaner;
  private sender: InviteSender;
  private manager: ReceivedInviteManager;

  constructor(state: IStore | AppState) {
    this.cleaner = new InviteCleanerImpl(state);
    this.sender = new InviteSenderImpl(state);
    this.manager = new ReceivedInviteManagerImpl(state);
  }

  reset() {
    return this.cleaner.reset();
  }

  sendPendingInvites() {
    return this.sender.sendPendingInvites();
  }

  addPendingInvite(user: string) {
    return this.sender.addPendingInvite(user);
  }

  cancelInvite(user: string) {
    return this.sender.cancelInvite(user);
  }

  accept() {
    return this.manager.accept();
  }

  decline() {
    return this.manager.decline();
  }

  updateStateOfSentInvite(invite: string, state: InviteStates) {
    return this.updateStateOfSentInvite(invite, state);
  }
}
