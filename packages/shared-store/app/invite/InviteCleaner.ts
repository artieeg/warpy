import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StateUpdate } from "../types";

export interface InviteCleaner {
  reset: () => Promise<StateUpdate>;
}

export class InviteCleanerImpl implements InviteCleaner {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async reset() {
    this.state.update({
      pendingInviteUserIds: [],
      sentInvites: {},
    });

    return this.state.getStateDiff();
  }
}
