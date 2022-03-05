import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IMediaNodeInfoRequest, INewMediaNode, MediaServiceRole } from '@warpy/lib';
import { NodeInfoService } from './node-info.service';
import { NodeRegistryService } from './node-registry.service';

@Controller()
export class MediaBalancerController {
  constructor(
    private nodeRegistryService: NodeRegistryService,
    private nodeInfoService: NodeInfoService,
  ) {}

  @MessagePattern('media.node.is-online')
  async onNewMediaNode({ id, role }: INewMediaNode) {
    await this.nodeRegistryService.addNewNode(id, role);
  }

  @MessagePattern('media.node.info')
  async onMediaNodeInfo({ node, load, role }: IMediaNodeInfoRequest) {
    this.nodeInfoService.set(node, { load, node, role: role as MediaServiceRole });
  }
}
