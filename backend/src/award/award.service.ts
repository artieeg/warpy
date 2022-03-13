import { InvalidVisual } from '@backend_2/errors';
import { EVENT_AWARD_SENT } from '@backend_2/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AwardEntity } from './award.entity';
import { CoinBalanceService } from './coin-balance/coin-balance.service';

@Injectable()
export class AwardService {
  constructor(
    private awardEntity: AwardEntity,
    private events: EventEmitter2,
    private coinBalanceService: CoinBalanceService,
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

    await this.coinBalanceService.check(sender, 300);

    const [award] = await Promise.all([
      this.awardEntity.create(sender, recipent, visual, message),
      this.coinBalanceService.update(sender, -300),
    ]);

    this.events.emit(EVENT_AWARD_SENT, { award });
  }
}
