import { AppInvite } from "@warpy/lib";
import { IStore } from "../Store";
import { AppState } from "../AppState";
import { Service } from "../Service";

export interface AppInviteData {
  appInvite: AppInvite | null;
}

export class AppInviteService extends Service<AppInviteData> {
  constructor(state: IStore | AppState) {
    super(state);
  }

  getInitialState() {
    return {
      appInvite: null,
    };
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
