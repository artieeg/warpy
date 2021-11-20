import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IGetAvailableAwardsResponse,
  ISendAwardRequest,
  ISendAwardResponse,
} from '@warpy/lib';
import { AwardService } from './award.service';

@Controller()
export class AwardController {
  constructor(private awardService: AwardService) {}

  @MessagePattern('awards.get-available')
  async getAwards(): Promise<IGetAvailableAwardsResponse> {
    const awards = await this.awardService.getAvailableAwards();

    return { awards };
  }

  @MessagePattern('awards.send-award')
  async sendAward({
    user,
    recipent,
    award_id,
  }: ISendAwardRequest): Promise<ISendAwardResponse> {
    console.log({ user, recipent, award_id });

    await this.awardService.sendAward(user, recipent, award_id);

    return {
      status: 'ok',
    };
  }
}
