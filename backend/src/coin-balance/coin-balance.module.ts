import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CoinBalanceController } from './coin-balance.controller';
import { CoinBalanceEntity } from './coin-balance.entity';

@Module({
  imports: [PrismaModule],
  providers: [CoinBalanceEntity],
  controllers: [CoinBalanceController],
  exports: [CoinBalanceEntity],
})
export class CoinBalanceModule {}
