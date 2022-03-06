import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ParticipantModule } from '@backend_2/participant/participant.module';
import { UserModule } from '@backend_2/user/user.module';

@Module({
  imports: [EventEmitter2, UserModule, ParticipantModule],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [],
})
export class ChatModule {}
