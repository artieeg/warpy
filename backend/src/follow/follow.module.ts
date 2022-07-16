import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { NjsFollowStore } from './follow.entity';
import { NjsFollowService } from './follow.service';

@Module({
  imports: [PrismaModule],
  providers: [NjsFollowStore, NjsFollowService],
  controllers: [FollowController],
  exports: [NjsFollowStore, NjsFollowService],
})
export class FollowModule {}
