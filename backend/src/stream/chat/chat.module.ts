import { forwardRef, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserModule } from '@backend_2/user/user.module';

@Module({
  imports: [EventEmitter2, forwardRef(() => UserModule)],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [],
})
export class ChatModule {}
