import { Module } from '@nestjs/common';
import { NjsNatsService } from './nats.service';

@Module({
  providers: [NjsNatsService],
  exports: [NjsNatsService],
})
export class NatsModule {}
