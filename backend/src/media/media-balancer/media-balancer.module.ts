import { Module } from '@nestjs/common';
import { MediaBalancerController } from './media-balancer.controller';
import { MediaBalancerService } from './media-balancer.service';
import { NodeInfoService } from './node-info.service';
import { NodeRegistryService } from './node-registry.service';
import { StreamNodeAssignerService } from './stream-node-assigner.service';

@Module({
  imports: [],
  providers: [
    MediaBalancerService,
    StreamNodeAssignerService,
    NodeRegistryService,
    NodeInfoService,
  ],
  controllers: [MediaBalancerController],
  exports: [MediaBalancerService],
})
export class MediaBalancerModule {}
