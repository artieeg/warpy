import { Module } from '@nestjs/common';
import { NodeRegistryController } from './node-registry.controller';
import { NjsNodeRegistryStore } from './node-registry.service';

@Module({
  imports: [],
  providers: [NjsNodeRegistryStore],
  controllers: [NodeRegistryController],
  exports: [NjsNodeRegistryStore],
})
export class NodeRegistryModule {}
