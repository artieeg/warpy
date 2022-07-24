import { Injectable, Controller, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { NjsUserStore, UserModule } from './user';
import { ChatService } from '@warpy-be/app';
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

@Controller()
export class ChatController {
  constructor(private chatService: NjsChatService) {}

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
  providers: [NjsChatService],
  controllers: [ChatController],
  exports: [],
})
export class ChatModule {}
