import { Injectable } from '@nestjs/common';
import { CoinBalanceEntity } from './coin-balance.entity';

@Injectable()
export class CoinBalanceService {
  constructor(private coinBalanceEntity: CoinBalanceEntity) {}

  async getCoinBalance(user: string) {
    try {
      const balance = this.coinBalanceEntity.getBalance(user);

      return balance;
    } catch (e) {
      return 0;
    }
  }
}
