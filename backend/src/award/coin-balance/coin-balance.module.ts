import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CoinBalanceController } from './coin-balance.controller';
import { CoinBalanceEntity } from './coin-balance.entity';
import { CoinBalanceService } from './coin-balance.service';

@Module({
  imports: [PrismaModule],
  providers: [CoinBalanceEntity, CoinBalanceService],
  controllers: [CoinBalanceController],
  exports: [CoinBalanceService],
})
export class CoinBalanceModule {}
