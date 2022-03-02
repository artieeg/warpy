import { Injectable } from '@nestjs/common';
import { NodeRegistryService } from './node-registry.service';

@Injectable()
export class MediaBalancerService {
  constructor(private nodeRegistryService: NodeRegistryService) {}

  async getSendNodeId() {
    return this.nodeRegistryService.getProducerNodeId();
  }

  async getRecvNodeId() {
    return this.nodeRegistryService.getConsumerNodeId();
  }
}
