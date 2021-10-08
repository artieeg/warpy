import { Module } from '@nestjs/common';
import { NatsModule } from '../nats/nats.module';
import { MessageService } from './message.service';

@Module({
  imports: [NatsModule],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
