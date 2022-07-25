import { InviteStates } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { Service } from "../Service";
import { InviteCleaner, InviteCleanerImpl } from "./InviteCleaner";
import { InviteSender, InviteSenderImpl } from "./InviteSender";
import {
  ReceivedInviteManager,
  ReceivedInviteManagerImpl,
} from "./ReceivedInviteManager";
import {
  SentInviteStateUpdater,
  SentInviteStateUpdaterImpl,
} from "./SentInviteStateUpdater";

export class InviteService extends Service {
  private cleaner: InviteCleaner;
  private sender: InviteSender;
  private manager: ReceivedInviteManager;
  private sentInviteStateUpdater: SentInviteStateUpdater;
  private state: AppState;

  constructor(state: IStore | AppState) {
    super(state);

    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }

    this.cleaner = new InviteCleanerImpl(this.state);
    this.sender = new InviteSenderImpl(this.state);
    this.manager = new ReceivedInviteManagerImpl(this.state);
    this.sentInviteStateUpdater = new SentInviteStateUpdaterImpl(this.state);
  }

  async fetchInviteSuggestions(stream: string) {
    const { api } = this.state.get();
    const suggestions = await api.stream.getInviteSuggestions(stream);

    return this.state.update({
      inviteSuggestions: suggestions,
    });
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
    return this.sentInviteStateUpdater.updateStateOfSentInvite(invite, state);
  }
}
