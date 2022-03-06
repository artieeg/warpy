import { Module } from '@nestjs/common';
import { ActiveSpeakerController } from './active-speaker.controller';
import { ActiveSpeakerService } from './active-speaker.service';

@Module({
  imports: [],
  providers: [ActiveSpeakerService],
  controllers: [ActiveSpeakerController],
  exports: [],
})
export class ActiveSpeakerModule {}
