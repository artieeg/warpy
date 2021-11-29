import { CoinBalanceEntity } from '@backend_2/coin-balance/coin-balance.entity';
import { AppInviteNotFound } from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { AppInviteEntity } from './app-invite.entity';

@Injectable()
export class AppInviteService {
  constructor(
    private appInviteEntity: AppInviteEntity,
    private coinBalanceEntity: CoinBalanceEntity,
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
    const inviteId = await this.appInviteEntity.findByCode(inviteCode);
  }
}
