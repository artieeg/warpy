import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IFriendFeedRequest } from '@warpy/lib';
import { FriendFeedService } from 'lib';
import { StreamModule, UserModule, FollowModule } from '.';

@Injectable()
export class NjsFriendFeedService extends FriendFeedService {}

@Controller()
export class FriendFeedController {
  constructor(private friendFeedService: NjsFriendFeedService) {}

  @MessagePattern('friend-feed.get')
  async onGetFriendFeed({ user }: IFriendFeedRequest) {
    const feed = await this.friendFeedService.getFriendFeed(user);

    return { feed };
  }
}

@Module({
  imports: [UserModule, FollowModule, StreamModule],
  providers: [NjsFriendFeedService],
  controllers: [FriendFeedController],
  exports: [NjsFriendFeedService],
})
export class FriendFeedModule {}
