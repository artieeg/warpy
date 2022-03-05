import { Module } from '@nestjs/common';
import { NodeInfoController } from './node-info.controller';
import { NodeInfoService } from './node-info.service';

@Module({
  imports: [],
  providers: [NodeInfoService],
  controllers: [NodeInfoController],
  exports: [NodeInfoService],
})
export class NodeInfoModule {}
