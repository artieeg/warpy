import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RequestFetchFriendFeed } from '@warpy/lib';
import { FriendFeedService } from '@warpy-be/app';
import { FollowModule, NjsFollowStore } from './follow';
import { NjsParticipantStore } from './participant';
import { NjsStreamStore, StreamModule } from './stream';
import { UserModule } from './user';
import { BroadcastModule, NjsBroadcastService } from './broadcast';

@Injectable()
export class NjsFriendFeedService extends FriendFeedService {
  constructor(
    participantStore: NjsParticipantStore,
    followStore: NjsFollowStore,
    streamStore: NjsStreamStore,
    broadcastService: NjsBroadcastService,
  ) {
    super(participantStore, followStore, streamStore, broadcastService);
  }
}

@Controller()
export class FriendFeedController {
  constructor(private friendFeedService: NjsFriendFeedService) {}

  @MessagePattern('friend-feed.get')
  async onGetFriendFeed({ user }: RequestFetchFriendFeed) {
    const feed = await this.friendFeedService.getFriendFeed(user);

    return { feed };
  }
}

@Module({
  imports: [UserModule, FollowModule, StreamModule, BroadcastModule],
  providers: [NjsFriendFeedService],
  controllers: [FriendFeedController],
  exports: [NjsFriendFeedService],
})
export class FriendFeedModule {}
