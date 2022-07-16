import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppInviteController } from './app-invite.controller';
import { NjsAppInviteStore } from './app-invite.entity';
import { NjsAppInviteService } from './app-invite.service';
import { NjsAppliedAppInviteStore } from './applied-app-invite.entity';

@Module({
  imports: [PrismaModule],
  providers: [NjsAppInviteStore, NjsAppliedAppInviteStore, NjsAppInviteService],
  controllers: [AppInviteController],
  exports: [NjsAppInviteStore, NjsAppliedAppInviteStore],
})
export class AppInviteModule {}
