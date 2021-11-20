import { Injectable } from '@nestjs/common';
import { AwardModelEntity } from './award-model.entity';

@Injectable()
export class AwardService {
  constructor(private awardModelEntity: AwardModelEntity) {}

  async getAvailableAwards() {
    return this.awardModelEntity.getAvailableAwards();
  }
}
