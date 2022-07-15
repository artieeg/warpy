import { Global, Module } from '@nestjs/common';
import { NatsModule } from '../nats/nats.module';
import { NjsMessageService } from './message.service';

@Module({
  imports: [NatsModule],
  providers: [NjsMessageService],
  exports: [NjsMessageService],
})
@Global()
export class MessageModule {}
