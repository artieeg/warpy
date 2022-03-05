import { Module } from '@nestjs/common';
import { NodeRegistryController } from './node-registry.controller';
import { NodeRegistryService } from './node-registry.service';

@Module({
  imports: [],
  providers: [NodeRegistryService],
  controllers: [NodeRegistryController],
  exports: [NodeRegistryService],
})
export class NodeRegistryModule {}
