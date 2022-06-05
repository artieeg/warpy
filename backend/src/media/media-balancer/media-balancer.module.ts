import { Module } from '@nestjs/common';
import { MediaBalancerService } from './media-balancer.service';
import { NodeInfoModule } from './node-info/node-info.module';
import { NodeRegistryModule } from './node-registry/node-registry.module';
import { StreamNodeAssignerModule } from './stream-node-assigner/stream-node-assigner.module';

@Module({
  imports: [StreamNodeAssignerModule, NodeInfoModule, NodeRegistryModule],
  providers: [MediaBalancerService],
  controllers: [],
  exports: [MediaBalancerService],
})
export class MediaBalancerModule {}
