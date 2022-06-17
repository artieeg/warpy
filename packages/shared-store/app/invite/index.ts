import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { InviteCleaner, InviteCleanerImpl } from "./InviteCleaner";

export class InviteService implements InviteCleaner {
  private cleaner: InviteCleaner;

  constructor(state: IStore | AppState) {
    this.cleaner = new InviteCleanerImpl(state);
  }

  reset() {
    return this.cleaner.reset();
  }
}
