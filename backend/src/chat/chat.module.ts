import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserModule } from '@warpy-be/user/user.module';
import { ChatMemberStore } from './chat-member.store';
import { BlockModule } from '@warpy-be/block/block.module';

@Module({
  imports: [EventEmitter2, BlockModule, UserModule],
  providers: [ChatService, ChatMemberStore],
  controllers: [ChatController],
  exports: [],
})
export class ChatModule {}
