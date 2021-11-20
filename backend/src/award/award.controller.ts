import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IGetAvailableAwardsResponse } from '../../../lib';
import { AwardService } from './award.service';

@Controller()
export class AwardController {
  constructor(private awardService: AwardService) {}

  @MessagePattern('awards.get-available')
  async getAwards(): Promise<IGetAvailableAwardsResponse> {
    const awards = await this.awardService.getAvailableAwards();

    return { awards };
  }
}
