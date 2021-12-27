import { FollowModule } from '@backend_2/follow/follow.module';
import { ParticipantModule } from '@backend_2/participant/participant.module';
import { StreamModule } from '@backend_2/stream/stream.module';
import { UserModule } from '@backend_2/user/user.module';
import { Module } from '@nestjs/common';
import { FriendFeedService } from './friend_feed.service';

@Module({
  imports: [ParticipantModule, FollowModule, StreamModule, UserModule],
  providers: [FriendFeedService],
  controllers: [],
  exports: [],
})
export class FriendFeedModule {}
