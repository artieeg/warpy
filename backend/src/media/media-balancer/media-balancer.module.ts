import { Module } from '@nestjs/common';
import { MediaBalancerService } from './media-balancer.service';
import { StreamNodeAssignerModule } from './node-assigner/node-assigner.module';
import { NodeInfoModule } from './node-info/node-info.module';
import { NodeRegistryModule } from './node-registry/node-registry.module';

@Module({
  imports: [StreamNodeAssignerModule, NodeInfoModule, NodeRegistryModule],
  providers: [MediaBalancerService],
  controllers: [],
  exports: [MediaBalancerService],
})
export class MediaBalancerModule {}
