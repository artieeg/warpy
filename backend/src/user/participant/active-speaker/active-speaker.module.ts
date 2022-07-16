import { Module } from '@nestjs/common';
import { ActiveSpeakerController } from './active-speaker.controller';
import { NjsActiveSpeakerService } from './active-speaker.service';

@Module({
  imports: [],
  providers: [NjsActiveSpeakerService],
  controllers: [ActiveSpeakerController],
  exports: [],
})
export class ActiveSpeakerModule {}
