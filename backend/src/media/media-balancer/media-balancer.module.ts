import { Module } from '@nestjs/common';
import { MediaBalancerController } from './media-balancer.controller';
import { MediaBalancerService } from './media-balancer.service';
import { NodeInfoService } from './node-info.service';
import { NodeRegistryService } from './node-registry.service';

@Module({
  imports: [],
  providers: [MediaBalancerService, NodeRegistryService, NodeInfoService],
  controllers: [MediaBalancerController],
  exports: [MediaBalancerService],
})
export class MediaBalancerModule {}
