import { IStore } from "../../useStore";
import { AppState } from "../AppState";

export class AppInviteService {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async get() {
    const { api } = this.state.get();

    const { invite: appInvite } = await api.app_invite.get(
      this.state.get().user!.id
    );

    return this.state.update({
      appInvite,
    });
  }

  async update() {
    const { api } = this.state.get();

    const { invite } = await api.app_invite.refresh();

    return this.state.update({
      appInvite: invite,
    });
  }
}
