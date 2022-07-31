import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RequestFetchFriendFeed } from '@warpy/lib';
import { FriendFeedService } from '@warpy-be/app';
import { FollowModule, NjsFollowStore } from './follow';
import { NjsParticipantStore } from './participant';
import { NjsStreamStore, StreamModule } from './stream';
import { UserModule } from './user';
import { BroadcastModule, NjsBroadcastService } from './broadcast';
import { OnNewParticipant, OnParticipantLeave } from '@warpy-be/interfaces';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_LEAVE,
} from '@warpy-be/utils';

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
export class FriendFeedController
  implements OnNewParticipant, OnParticipantLeave
{
  constructor(private friendFeedService: NjsFriendFeedService) {}

  @OnEvent(EVENT_NEW_PARTICIPANT)
  async onNewParticipant({ participant: { id } }) {
    await this.friendFeedService.notifyUserJoin(id);
  }

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user }) {
    await this.friendFeedService.notifyUserLeave(user);
  }

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
