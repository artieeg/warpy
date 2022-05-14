import { StreamModule } from '@warpy-be/stream/stream.module';
import { Module } from '@nestjs/common';
import { FriendFeedController } from './friend_feed.controller';
import { FriendFeedService } from './friend_feed.service';
import { UserModule } from '@warpy-be/user/user.module';
import { FollowModule } from '@warpy-be/user/follow/follow.module';

@Module({
  imports: [UserModule, FollowModule, StreamModule],
  providers: [FriendFeedService],
  controllers: [FriendFeedController],
  exports: [FriendFeedService],
})
export class FriendFeedModule {}
