import { ParticipantModule } from '@warpy-be/user/participant/participant.module';
import { Module } from '@nestjs/common';
import { StreamCommonModule } from '../common/stream-common.module';
import { NjsPreviousStreamStore } from './previous-stream.cache';
import { PreviousStreamController } from './previous-stream.controller';
import { PreviousStreamService } from './previous-stream.service';

@Module({
  imports: [StreamCommonModule],
  providers: [NjsPreviousStreamStore, PreviousStreamService],
  controllers: [PreviousStreamController],
  exports: [],
})
export class PreviousStreamModule {}
