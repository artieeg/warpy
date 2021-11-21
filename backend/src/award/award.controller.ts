import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IFetchReceivedAwardsRequest,
  IGetAvailableAwardsResponse,
  IReceivedAwardsResponse,
  ISendAwardRequest,
  ISendAwardResponse,
} from '@warpy/lib';
import { AwardService } from './award.service';

@Controller()
export class AwardController {
  constructor(private awardService: AwardService) {}

  @MessagePattern('awards.get-received')
  async getReceivedAwards({
    target,
  }: IFetchReceivedAwardsRequest): Promise<IReceivedAwardsResponse> {
    const awards = await this.awardService.getReceivedAwards(target);

    return { awards };
  }

  @MessagePattern('awards.get-available')
  async getAvailableAwards(): Promise<IGetAvailableAwardsResponse> {
    const awards = await this.awardService.getAvailableAwards();

    return { awards };
  }

  @MessagePattern('awards.send-award')
  async sendAward({
    user,
    recipent,
    award_id,
    message,
  }: ISendAwardRequest): Promise<ISendAwardResponse> {
    console.log({ user, recipent, award_id });

    await this.awardService.sendAward(user, recipent, award_id, message);

    return {
      status: 'ok',
    };
  }
}
