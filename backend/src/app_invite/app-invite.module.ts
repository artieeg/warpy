import { CoinBalanceModule } from '@backend_2/coin-balance/coin-balance.module';
import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppInviteController } from './app-invite.controller';
import { AppInviteEntity } from './app-invite.entity';
import { AppInviteService } from './app-invite.service';
import { AppliedAppInviteEntity } from './applied-app-invite.entity';

@Module({
  imports: [PrismaModule, CoinBalanceModule],
  providers: [AppInviteEntity, AppliedAppInviteEntity, AppInviteService],
  controllers: [AppInviteController],
  exports: [AppInviteEntity, AppliedAppInviteEntity],
})
export class AppInviteModule {}
