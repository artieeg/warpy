import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { INewMediaNode } from '@warpy/lib';
import { NjsNodeRegistryStore } from './node-registry.service';

@Controller()
export class NodeRegistryController {
  constructor(private nodeRegistryService: NjsNodeRegistryStore) {}

  @MessagePattern('media.node.is-online')
  async onNewMediaNode({ id, role }: INewMediaNode) {
    await this.nodeRegistryService.addNewNode(id, role);
  }
}
