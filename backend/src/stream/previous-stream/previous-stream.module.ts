import { ParticipantModule } from '@backend_2/user/participant/participant.module';
import { Module } from '@nestjs/common';
import { StreamCommonModule } from '../common/stream-common.module';
import { PreviousStreamCacheService } from './previous-stream.cache';
import { PreviousStreamController } from './previous-stream.controller';
import { PreviousStreamService } from './previous-stream.service';

@Module({
  imports: [StreamCommonModule],
  providers: [PreviousStreamCacheService, PreviousStreamService],
  controllers: [PreviousStreamController],
  exports: [],
})
export class PreviousStreamModule {}
