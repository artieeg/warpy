import { Injectable, OnModuleInit, Controller, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  OnParticipantLeave,
  OnStreamEnd,
  OnNewParticipant,
  OnParticipantRejoin,
} from '@warpy-be/interfaces';
import { NjsUserStore, UserModule } from './user';
import {
  EVENT_PARTICIPANT_REJOIN,
  EVENT_NEW_PARTICIPANT,
  EVENT_STREAM_ENDED,
  EVENT_PARTICIPANT_LEAVE,
} from '@warpy-be/utils';
import { ChatService, ChatMemberStore } from 'lib';
import { INewChatMessage, ISendMessageResponse } from '@warpy/lib';
import { NjsParticipantStore } from './participant';
import { NjsUserBlockService, UserBlockModule } from './user-block';

@Injectable()
export class NjsChatService extends ChatService {
  constructor(
    events: EventEmitter2,
    userStore: NjsUserStore,
    participantStore: NjsParticipantStore,
    userBlockService: NjsUserBlockService,
  ) {
    super(events, userStore, participantStore, userBlockService);
  }
}

@Injectable()
export class NjsChatMemberStore
  extends ChatMemberStore
  implements OnModuleInit
{
  constructor(config: ConfigService) {
    super(config.get('chatMemberStoreAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Controller()
export class ChatController
  implements
    OnParticipantLeave,
    OnStreamEnd,
    OnNewParticipant,
    OnParticipantRejoin
{
  constructor(
    private chatService: NjsChatService,
    private chatMemberStore: NjsChatMemberStore,
  ) {}

  @OnEvent(EVENT_PARTICIPANT_REJOIN)
  async onParticipantRejoin({ participant }) {
    return this.chatMemberStore.addChatMember(
      participant.stream,
      participant.id,
    );
  }

  @OnEvent(EVENT_NEW_PARTICIPANT)
  async onNewParticipant({ participant }) {
    return this.chatMemberStore.addChatMember(
      participant.stream,
      participant.id,
    );
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    return this.chatMemberStore.deleteChatMembers(stream);
  }

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user, stream }) {
    return this.chatMemberStore.deleteChatMember(stream, user);
  }

  @MessagePattern('stream.new-chat-message')
  async onNewChatMessage({
    user,
    message,
  }: INewChatMessage): Promise<ISendMessageResponse> {
    try {
      const newChatMessage = await this.chatService.sendNewMessage(
        user,
        message,
      );

      return { message: newChatMessage };
    } catch (e) {
      console.error(e);
    }
  }
}

@Module({
  imports: [EventEmitter2, UserBlockModule, UserModule],
  providers: [NjsChatService, NjsChatMemberStore],
  controllers: [ChatController],
  exports: [],
})
export class ChatModule {}
