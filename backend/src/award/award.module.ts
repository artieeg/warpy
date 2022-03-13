import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AwardController } from './award.controller';
import { AwardEntity } from './award.entity';
import { AwardService } from './award.service';
import { CoinBalanceModule } from './coin-balance/coin-balance.module';

@Module({
  imports: [PrismaModule, CoinBalanceModule],
  providers: [AwardService, AwardEntity],
  controllers: [AwardController],
  exports: [],
})
export class AwardModule {}
