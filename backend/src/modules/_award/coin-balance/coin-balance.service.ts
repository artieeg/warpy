import { NotEnoughCoins } from '@warpy-be/errors';
import { Injectable } from '@nestjs/common';
import { User } from '@warpy/lib';
import { CoinBalanceEntity } from './coin-balance.entity';

@Injectable()
export class CoinBalanceService {
  constructor(private coinBalanceEntity: CoinBalanceEntity) {}

  async createBalance(user: User) {
    this.coinBalanceEntity.createCoinBalance(user.id, 2000);
  }

  async check(owner: string, min: number) {
    const balance = await this.coinBalanceEntity.getBalance(owner);

    if (balance <= min) {
      throw new NotEnoughCoins();
    }
  }

  async processAcceptedInvite(inviter: string, invited: string) {
    return Promise.all([
      this.coinBalanceEntity.updateBalance(invited, 3000),
      this.coinBalanceEntity.updateBalance(inviter, 3000),
    ]);
  }

  async update(owner: string, change: number) {
    return this.coinBalanceEntity.updateBalance(owner, change);
  }

  async getCoinBalance(user: string) {
    try {
      const balance = this.coinBalanceEntity.getBalance(user);

      return balance;
    } catch (e) {
      return 0;
    }
  }
}
