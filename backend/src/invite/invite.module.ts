import { Module } from '@nestjs/common';
import { NjsInviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { TokenModule } from '@warpy-be/token/token.module';
import { BotsModule } from '@warpy-be/bots/bots.module';
import { UserModule } from '@warpy-be/user/user.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { NjsInviteStore } from './invite.store';
import { StreamModule } from '@warpy-be/stream/stream.module';

@Module({
  imports: [PrismaModule, StreamModule, UserModule, TokenModule, BotsModule],
  providers: [NjsInviteStore, NjsInviteService],
  controllers: [InviteController],
  exports: [],
})
export class InviteModule {}
