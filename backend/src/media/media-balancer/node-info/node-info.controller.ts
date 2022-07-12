import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IMediaNodeInfoRequest, MediaServiceRole } from '@warpy/lib';
import { NjsNodeInfoStore } from './node-info.service';

@Controller()
export class NodeInfoController {
  constructor(private nodeInfoService: NjsNodeInfoStore) {}

  @MessagePattern('media.node.info')
  async onMediaNodeInfo({ node, load, role }: IMediaNodeInfoRequest) {
    this.nodeInfoService.set(node, {
      load,
      node,
      role: role as MediaServiceRole,
    });
  }
}
