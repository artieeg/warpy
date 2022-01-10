import { CoinBalanceEntity } from '@backend_2/coin-balance/coin-balance.entity';
import { InvalidVisual, NotEnoughCoins } from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AwardEntity } from './award.entity';

@Injectable()
export class AwardService {
  constructor(
    private awardEntity: AwardEntity,
    private events: EventEmitter2,
    private coinBalanceEntity: CoinBalanceEntity,
  ) {}

  async getReceivedAwards(user: string) {
    return this.awardEntity.getByRecipent(user);
  }

  private async validateVisual(visual: string) {
    const url = new URL(visual);

    if (!url.hostname.includes('tenor.com')) {
      throw new InvalidVisual();
    }
  }

  async sendAward(
    sender: string,
    recipent: string,
    visual: string,
    message: string,
  ) {
    await this.validateVisual(visual);

    if (!(await this.coinBalanceEntity.check(sender, 300))) {
      throw new NotEnoughCoins();
    }

    await this.coinBalanceEntity.updateBalance(sender, -300);
    const award = await this.awardEntity.create(
      sender,
      recipent,
      visual,
      message,
    );

    this.events.emit('award.sent', { award });
  }
}
