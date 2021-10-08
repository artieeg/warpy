import { PrismaModule } from '../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { InviteEntity } from './invite.entity';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { FollowModule } from '@backend_2/follow/follow.module';

@Module({
  imports: [PrismaModule, FollowModule],
  providers: [InviteEntity, InviteService],
  controllers: [InviteController],
  exports: [],
})
export class InviteModule {}
