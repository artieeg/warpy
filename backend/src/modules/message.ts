import { Global, Injectable, Module } from '@nestjs/common';
import { NatsModule } from './nats';
import { MessageService } from 'lib';

@Injectable()
export class NjsMessageService extends MessageService {}

@Module({
  imports: [NatsModule],
  providers: [NjsMessageService],
  exports: [NjsMessageService],
})
@Global()
export class MessageModule {}
