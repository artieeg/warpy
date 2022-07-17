import { Injectable, Module } from '@nestjs/common';
import { MediaBalancerService } from 'lib';
import { NjsNodeInfoStore, NodeInfoModule } from './node-info';
import { NjsNodeRegistryStore, NodeRegistryModule } from './node-registry';
import {
  NjsStreamNodeAssignerStore,
  StreamNodeAssignerModule,
} from './stream-media-node-assigner';

@Injectable()
export class NjsMediaBalancerService extends MediaBalancerService {
  constructor(
    nodeRegistryStore: NjsNodeRegistryStore,
    streamNodeAssigner: NjsStreamNodeAssignerStore,
    nodeInfoStore: NjsNodeInfoStore,
  ) {
    super(nodeRegistryStore, streamNodeAssigner, nodeInfoStore);
  }
}

@Module({
  imports: [StreamNodeAssignerModule, NodeInfoModule, NodeRegistryModule],
  providers: [MediaBalancerService],
  controllers: [],
  exports: [MediaBalancerService],
})
export class MediaBalancerModule {}
