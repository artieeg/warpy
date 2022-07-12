import { Module } from '@nestjs/common';
import { NodeInfoController } from './node-info.controller';
import { NjsNodeInfoStore } from './node-info.service';

@Module({
  imports: [],
  providers: [NjsNodeInfoStore],
  controllers: [NodeInfoController],
  exports: [NjsNodeInfoStore],
})
export class NodeInfoModule {}
