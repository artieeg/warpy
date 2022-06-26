import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { Service } from "../Service";

export class AppInviteService extends Service {
  constructor(state: IStore | AppState) {
    super(state);
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
