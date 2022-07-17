import { Global, Injectable, Module } from '@nestjs/common';
import { NatsModule } from './nats';
import { MessageService, NatsService } from 'lib';

@Injectable()
export class NjsMessageService extends MessageService {
  constructor(nc: NatsService) {
    super(nc);
  }
}

@Module({
  imports: [NatsModule],
  providers: [NjsMessageService],
  exports: [NjsMessageService],
})
@Global()
export class MessageModule {}
