import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  OnNewParticipant,
  OnParticipantLeave,
  OnParticipantRejoin,
  OnStreamEnd,
} from '@warpy-be/interfaces';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_LEAVE,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_STREAM_ENDED,
} from '@warpy-be/utils';
import { INewChatMessage, ISendMessageResponse } from '@warpy/lib';
import { NjsChatMemberStore } from './chat-member.store';
import { NjsChatService } from './chat.service';

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
