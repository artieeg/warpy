import { Module } from '@nestjs/common';
import { PreviousStreamCacheService } from './previous-stream.cache';
import { PreviousStreamController } from './previous-stream.controller';
import { PreviousStreamService } from './previous-stream.service';

@Module({
  imports: [],
  providers: [PreviousStreamCacheService, PreviousStreamService],
  controllers: [PreviousStreamController],
  exports: [],
})
export class PreviousStreamModule {}
