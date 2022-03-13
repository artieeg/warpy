import { StreamModule } from '@warpy-be/stream/stream.module';
import { Module } from '@nestjs/common';
import { FollowModule } from '../follow/follow.module';
import { ParticipantModule } from '../participant/participant.module';
import { FriendFeedController } from './friend_feed.controller';
import { FriendFeedService } from './friend_feed.service';

@Module({
  imports: [ParticipantModule, FollowModule, StreamModule],
  providers: [FriendFeedService],
  controllers: [FriendFeedController],
  exports: [FriendFeedService],
})
export class FriendFeedModule {}
