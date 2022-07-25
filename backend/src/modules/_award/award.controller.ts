import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  RequestFetchReceivedAwards,
  ReceivedAwardsResponse,
  RequestSendAward,
  SendAwardResponse,
} from '@warpy/lib';
import { AwardService } from './award.service';

@Controller()
export class AwardController {
  constructor(private awardService: AwardService) {}

  @MessagePattern('awards.get-received')
  async getReceivedAwards({
    target,
  }: RequestFetchReceivedAwards): Promise<ReceivedAwardsResponse> {
    const awards = await this.awardService.getReceivedAwards(target);

    return { awards };
  }

  @MessagePattern('awards.send-award')
  async sendAward({
    user,
    recipent,
    visual,
    message,
  }: RequestSendAward): Promise<SendAwardResponse> {
    await this.awardService.sendAward(user, recipent, visual, message);

    return {
      status: 'ok',
    };
  }
}
