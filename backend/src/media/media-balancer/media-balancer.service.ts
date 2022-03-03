import { Injectable } from '@nestjs/common';
import { NodeRegistryService } from './node-registry.service';

@Injectable()
export class MediaBalancerService {
  constructor(private nodeRegistryService: NodeRegistryService) {}

  async selectOptimalNode(ids: string[]) {
    return ids[Math.floor(Math.random() * ids.length)];
  }

  async getSendNodeId() {
    const ids = await this.nodeRegistryService.getNodeIds('PRODUCER');

    return this.selectOptimalNode(ids);
  }

  async getRecvNodeId() {
    const ids = await this.nodeRegistryService.getNodeIds('CONSUMER');

    return this.selectOptimalNode(ids);
  }
}
