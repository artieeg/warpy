import { Module } from '@nestjs/common';
import { StreamBlockEntity } from './stream-block.entity';
import { StreamBlockService } from './stream-block.service';

@Module({
  providers: [StreamBlockEntity, StreamBlockService],
  exports: [StreamBlockService],
})
export class StreamBlockModule {}
