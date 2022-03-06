import {
  AppInviteAlreadyAccepted,
  CantInviteYourself,
} from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { CoinBalanceEntity } from '../coin-balance/coin-balance.entity';
import { AppInviteEntity } from './app-invite.entity';
import { AppliedAppInviteEntity } from './applied-app-invite.entity';

@Injectable()
export class AppInviteService {
  constructor(
    private appInviteEntity: AppInviteEntity,
    private coinBalanceEntity: CoinBalanceEntity,
    private appliedInviteEntity: AppliedAppInviteEntity,
  ) {}

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

    await Promise.all([
      this.appliedInviteEntity.create(user, inviteId),
      this.coinBalanceEntity.updateBalance(user, 3000),
      this.coinBalanceEntity.updateBalance(inviterId, 3000),
    ]);

    return {
      status: 'ok',
    };
  }
}
