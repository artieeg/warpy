import { AppInviteAlreadyAccepted, CantInviteYourself } from '@warpy-be/errors';
import { UserBase } from '@warpy/lib';
import { AppInviteStore } from './app-invite.store';
import { AppliedAppInviteStore } from './applied-app-invite.store';

export class AppInviteService {
  constructor(
    private appInviteStore: AppInviteStore,
    private appliedInviteStore: AppliedAppInviteStore,
  ) {}

  async createAppInvite(user: UserBase) {
    return this.appInviteStore.create(user.id);
  }

  async getById(id: string) {
    return this.appInviteStore.findById(id);
  }

  async get(user_id: string) {
    return this.appInviteStore.find(user_id);
  }

  async update(user_id: string) {
    return this.appInviteStore.updateInviteCode(user_id);
  }

  async accept(user: string, inviteCode: string) {
    const appliedInviteId = await this.appliedInviteStore.find(user);

    if (appliedInviteId) {
      throw new AppInviteAlreadyAccepted();
    }

    const { id: inviteId, user_id: inviterId } =
      await this.appInviteStore.findByCode(inviteCode);

    if (user === inviterId) {
      throw new CantInviteYourself();
    }

    await this.appliedInviteStore.create(user, inviteId);

    return {
      status: 'ok',
    };
  }
}
