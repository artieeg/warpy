import { CoinBalanceEntity } from '@backend_2/coin-balance/coin-balance.entity';
import { NotEnoughCoins } from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AwardModelEntity } from './award-model.entity';
import { AwardEntity } from './award.entity';

@Injectable()
export class AwardService {
  constructor(
    private awardModelEntity: AwardModelEntity,
    private awardEntity: AwardEntity,
    private events: EventEmitter2,
    private coinBalanceEntity: CoinBalanceEntity,
  ) {}

  async getReceivedAwards(user: string) {
    return this.awardEntity.getByRecipent(user);
  }

  async getAvailableAwards() {
    return this.awardModelEntity.getAvailableAwards();
  }

  async sendAward(
    sender: string,
    recipent: string,
    award_id: string,
    message: string,
  ) {
    //Fetch award model to see the price
    const awardModel = await this.awardModelEntity.find(award_id);

    if (!(await this.coinBalanceEntity.check(sender, awardModel.price))) {
      throw new NotEnoughCoins();
    }

    await this.coinBalanceEntity.updateBalance(sender, -awardModel.price);
    const award = await this.awardEntity.create(
      sender,
      recipent,
      award_id,
      message,
    );

    this.events.emit('award.sent', { award });
  }
}
