import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { InviteEntity } from './invite.entity';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { FollowModule } from '@backend_2/follow/follow.module';
import { StreamModule } from '@backend_2/stream/stream.module';
import { MessageModule } from '@backend_2/message/message.module';
import { TokenModule } from '@backend_2/token/token.module';

@Module({
  imports: [
    PrismaModule,
    StreamModule,
    FollowModule,
    MessageModule,
    TokenModule,
  ],
  providers: [InviteEntity, InviteService],
  controllers: [InviteController],
  exports: [],
})
export class InviteModule {}
