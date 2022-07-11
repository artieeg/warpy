import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowStore } from './follow.entity';
import { FollowService } from './follow.service';

@Module({
  imports: [PrismaModule],
  providers: [FollowStore, FollowService],
  controllers: [FollowController],
  exports: [FollowStore, FollowService],
})
export class FollowModule {}
