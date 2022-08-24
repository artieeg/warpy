import { Global, Injectable, Module } from '@nestjs/common';
import { NatsModule, NjsNatsService } from './nats';
import { MessageService } from '@warpy-be/app';

@Injectable()
export class NjsMessageService extends MessageService {
  constructor(nc: NjsNatsService) {
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
