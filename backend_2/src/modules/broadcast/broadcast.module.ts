import { Module } from '@nestjs/common';
import { NatsModule } from '../nats/nats.module';
import { ParticipantModule } from '../participant/participant.module';
import { BroadcastService } from './broadcast.service';

@Module({
  imports: [NatsModule, ParticipantModule],
  providers: [BroadcastService],
})
export class BroadcastModule {}
