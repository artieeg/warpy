import { InviteStates } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StateUpdate } from "../types";

export interface SentInviteStateUpdater {
  updateStateOfSentInvite: (
    invite: string,
    state: InviteStates
  ) => Promise<StateUpdate>;
}

export class SentInviteStateUpdaterImpl implements SentInviteStateUpdater {
  private state: AppState;

  constructor(state: AppState | IStore) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async updateStateOfSentInvite(invite: string, state: InviteStates) {
    const sentInviteData = this.state.get().sentInvites[invite];

    if (!sentInviteData) {
      throw new Error("Invite does not exist");
    }

    return this.state.update({
      sentInvites: {
        ...this.state.get().sentInvites,
        [invite]: {
          ...sentInviteData,
          state,
        },
      },
    });
  }
}
