import { Module } from '@nestjs/common';
import { StreamNodeAssignerController } from './stream-node-assigner.controller';
import { StreamNodeAssignerService } from './stream-node-assigner.service';

@Module({
  imports: [],
  providers: [StreamNodeAssignerService],
  controllers: [StreamNodeAssignerController],
  exports: [StreamNodeAssignerService],
})
export class StreamNodeAssignerModule {}
