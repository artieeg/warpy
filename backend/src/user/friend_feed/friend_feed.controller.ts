import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IFriendFeedRequest } from '@warpy/lib';
import { FriendFeedService } from './friend_feed.service';

@Controller()
export class FriendFeedController {
  constructor(private friendFeedService: FriendFeedService) {}

  @MessagePattern('friend-feed.get')
  async onGetFriendFeed({ user }: IFriendFeedRequest) {
    const feed = await this.friendFeedService.getFriendFeed(user);

    return { feed };
  }
}
