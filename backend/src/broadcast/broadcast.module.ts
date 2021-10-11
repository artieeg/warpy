import { Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { ParticipantModule } from '../participant/participant.module';
import { BroadcastService } from './broadcast.service';

@Module({
  imports: [MessageModule, ParticipantModule],
  providers: [BroadcastService],
})
export class BroadcastModule {}