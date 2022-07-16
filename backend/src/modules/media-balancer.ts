import { Injectable, Module } from '@nestjs/common';
import { MediaBalancerService } from 'lib';
import { NodeInfoModule, NodeRegistryModule } from '.';
import { StreamNodeAssignerModule } from './stream-media-node-assigner';

@Injectable()
export class NjsMediaBalancerService extends MediaBalancerService {}

@Module({
  imports: [StreamNodeAssignerModule, NodeInfoModule, NodeRegistryModule],
  providers: [MediaBalancerService],
  controllers: [],
  exports: [MediaBalancerService],
})
export class MediaBalancerModule {}
