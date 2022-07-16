import { StreamModule } from '@warpy-be/stream/stream.module';
import { Module } from '@nestjs/common';
import { FriendFeedController } from './friend_feed.controller';
import { NjsFriendFeedService } from './friend_feed.service';
import { UserModule } from '@warpy-be/user/user.module';
import { FollowModule } from '@warpy-be/follow/follow.module';

@Module({
  imports: [UserModule, FollowModule, StreamModule],
  providers: [NjsFriendFeedService],
  controllers: [FriendFeedController],
  exports: [NjsFriendFeedService],
})
export class FriendFeedModule {}
