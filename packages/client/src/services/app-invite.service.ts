import { AppInvite } from "@warpy/lib";
import { Service } from "../Service";

export interface AppInviteData {
  appInvite: AppInvite | null;
}

export class AppInviteService extends Service<AppInviteData> {
  getInitialState() {
    return {
      appInvite: null,
    };
  }

  async getAppInvite() {
    const { api } = this.get();

    const { invite: appInvite } = await api.app_invite.get(this.get().user!.id);

    return this.set({
      appInvite,
    });
  }

  async update() {
    const { api } = this.get();

    const { invite } = await api.app_invite.refresh();

    return this.set({
      appInvite: invite,
    });
  }
}
