import { AppInviteAlreadyAccepted, CantInviteYourself } from '@warpy-be/errors';
import { IAppInvite, IUser } from '@warpy/lib';
import { IAppInviteStore } from './app-invite.store';
import { IAppliedAppInviteStore } from './applied-app-invite.store';


export interface IAppInviteService {
  createAppInvite(user: IUser): Promise<IAppInvite>;
  getById(id: string): Promise<IAppInvite>;
  get(user_id: string): Promise<IAppInvite>;
  update(user_id: string): Promise<IAppInvite>;
  accept(user: string, inviteCode: string): Promise<{ status: string }>;
}

export class AppInviteService implements IAppInviteService {
  constructor(
    private appInviteEntity: IAppInviteStore,
    private appliedInviteEntity: IAppliedAppInviteStore,
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
