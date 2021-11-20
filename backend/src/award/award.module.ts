import { CoinBalanceModule } from '@backend_2/coin-balance/coin-balance.module';
import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AwardModelEntity } from './award-model.entity';
import { AwardController } from './award.controller';
import { AwardEntity } from './award.entity';
import { AwardService } from './award.service';

@Module({
  imports: [PrismaModule, CoinBalanceModule],
  providers: [AwardService, AwardModelEntity, AwardEntity],
  controllers: [AwardController],
  exports: [],
})
export class AwardModule {}
