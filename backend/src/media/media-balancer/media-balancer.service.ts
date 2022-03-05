import { Injectable } from '@nestjs/common';
import { MediaServiceRole } from '@warpy/lib';
import { NodeInfoService } from './node-info.service';
import { NodeRegistryService } from './node-registry.service';
import { StreamNodeAssignerService } from './stream-node-assigner.service';

@Injectable()
export class MediaBalancerService {
  constructor(
    private nodeRegistryService: NodeRegistryService,
    private streamNodeAssigner: StreamNodeAssignerService,
    private nodeInfoService: NodeInfoService,
  ) {}

  private async selectOptimalNode(stream: string, nodeRole: MediaServiceRole) {
    //Get all available nodes of a requested type
    const availableNodeIds = await this.nodeRegistryService.getNodeIds(
      nodeRole,
    );

    //Get nodes that are currently assigned to this stream
    const assignedNodeIds = await this.streamNodeAssigner.getAssignedNodes(
      stream,
    );

    //Fetch their info
    const assignedNodesInfo = (
      await Promise.all(
        assignedNodeIds.map((id) => this.nodeInfoService.get(id)),
      )
    ).filter((node) => node.role === nodeRole); //filter only the requested role

    return availableNodeIds[
      Math.floor(Math.random() * availableNodeIds.length)
    ];
  }

  async getSendNodeId(stream: string) {
    return this.selectOptimalNode(stream, 'PRODUCER');
  }

  async getRecvNodeId(stream: string) {
    return this.selectOptimalNode(stream, 'CONSUMER');
  }
}
