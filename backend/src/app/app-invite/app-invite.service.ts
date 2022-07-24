import { AppInviteAlreadyAccepted, CantInviteYourself } from '@warpy-be/errors';
import { IUser } from '@warpy/lib';
import { AppInviteStore } from './app-invite.store';
import { AppliedAppInviteStore } from './applied-app-invite.store';

export class AppInviteService {
  constructor(
    private appInviteEntity: AppInviteStore,
    private appliedInviteEntity: AppliedAppInviteStore,
  ) {}

  async createAppInvite(user: IUser) {
    return this.appInviteEntity.create(user.id);
  }

  async getById(id: string) {
    return this.appInviteEntity.findById(id);
  }

  async get(user_id: string) {
    return this.appInviteEntity.find(user_id);
  }

  async update(user_id: string) {
    return this.appInviteEntity.updateInviteCode(user_id);
  }

  async accept(user: string, inviteCode: string) {
    const appliedInviteId = await this.appliedInviteEntity.find(user);

    if (appliedInviteId) {
      throw new AppInviteAlreadyAccepted();
    }

    const { id: inviteId, user_id: inviterId } =
      await this.appInviteEntity.findByCode(inviteCode);

    if (user === inviterId) {
      throw new CantInviteYourself();
    }

    await this.appliedInviteEntity.create(user, inviteId);

    return {
      status: 'ok',
    };
  }
}
