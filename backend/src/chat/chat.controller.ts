import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { INewChatMessage, ISendMessageResponse } from '@warpy/lib';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private chatService: ChatService) {}

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
