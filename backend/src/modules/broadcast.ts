import {
  Controller,
  Global,
  Injectable,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { OnStreamEnd, OnRoleChange } from '@warpy-be/interfaces';
import {
  EVENT_STREAM_ENDED,
  EVENT_STREAMER_MEDIA_TOGGLE,
  EVENT_PARTICIPANT_KICKED,
  EVENT_CHAT_MESSAGE,
  EVENT_REACTIONS,
  EVENT_ACTIVE_SPEAKERS,
  EVENT_ROLE_CHANGE,
  EVENT_RAISE_HAND,
} from '@warpy-be/utils';
import {
  BroadcastUserListStore,
  BroadcastService,
  ActiveSpeakersEvent,
  ChatMessageEvent,
  MediaToggleEvent,
  ReactionsEvent,
} from '@warpy-be/app';
import { Participant } from '@warpy/lib';
import { NjsMessageService } from './message';

@Injectable()
export class NjsBroadcastUserListStore
  extends BroadcastUserListStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('broadcastUserListStoreAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Injectable()
export class NjsBroadcastService extends BroadcastService {
  constructor(
    messageService: NjsMessageService,
    broadcastUserListStore: NjsBroadcastUserListStore,
  ) {
    super(messageService, broadcastUserListStore);
  }
}

@Controller()
export class BroadcastController implements OnStreamEnd, OnRoleChange {
  constructor(
    private broadcast: NjsBroadcastService,
    private store: NjsBroadcastUserListStore,
  ) {}

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    await this.broadcast.broadcastStreamEnd(stream);
    await this.store.deleteList(stream);
  }

  @OnEvent(EVENT_STREAMER_MEDIA_TOGGLE)
  async onMediaToggle(data: MediaToggleEvent) {
    return this.broadcast.broadcastMediaToggle(data);
  }

  @OnEvent(EVENT_PARTICIPANT_KICKED)
  async onParticipantKicked(data: Participant) {
    return Promise.all([
      this.broadcast.broadcastKickedParticipant(data),
      this.store.removeUserFromList(data.stream, data.id),
    ]);
  }

  @OnEvent(EVENT_CHAT_MESSAGE)
  async onChatMessage(data: ChatMessageEvent) {
    return this.broadcast.broadcastChatMessage(data);
  }

  @OnEvent(EVENT_REACTIONS)
  async onReactions(data: ReactionsEvent) {
    return this.broadcast.broadcastReactions(data);
  }

  @OnEvent(EVENT_ACTIVE_SPEAKERS)
  async onActiveSpeakers(data: ActiveSpeakersEvent) {
    return this.broadcast.broadcastActiveSpeakers(data);
  }

  @OnEvent(EVENT_ROLE_CHANGE)
  async onRoleChange({ participant }) {
    return this.broadcast.broadcastRoleChange(participant);
  }

  @OnEvent(EVENT_RAISE_HAND)
  async onRaiseHand(data: Participant) {
    console.log(data);
    return this.broadcast.broadcastHandRaise(data);
  }
}

@Module({
  imports: [],
  controllers: [BroadcastController],
  providers: [NjsBroadcastService, NjsBroadcastUserListStore],
  exports: [NjsBroadcastService],
})
@Global()
export class BroadcastModule {}
