import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowEntity } from './follow.entity';
import { FollowService } from './follow.service';

@Module({
  imports: [PrismaModule],
  providers: [FollowEntity, FollowService],
  controllers: [FollowController],
  exports: [FollowEntity, FollowService],
})
export class FollowModule {}
