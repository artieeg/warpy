import { Module } from '@nestjs/common';
import { StreamNodeAssignerController } from './node-assigner.controller';
import { StreamNodeAssignerService } from './node-assigner.service';

@Module({
  imports: [],
  providers: [StreamNodeAssignerService],
  controllers: [StreamNodeAssignerController],
  exports: [StreamNodeAssignerService],
})
export class StreamNodeAssignerModule {}
