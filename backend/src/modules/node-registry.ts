import { Injectable, OnModuleInit, Controller, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';
import { NodeRegistryStore } from '@warpy-be/app';
import { INewMediaNode } from '@warpy/lib';

@Injectable()
/** Stores arrays of online send/recv media nodes */
export class NjsNodeRegistryStore
  extends NodeRegistryStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('mediaServerIdsCache'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Controller()
export class NodeRegistryController {
  constructor(private nodeRegistryService: NjsNodeRegistryStore) {}

  @MessagePattern('media.node.is-online')
  async onNewMediaNode({ id, role }: INewMediaNode) {
    await this.nodeRegistryService.addNewNode(id, role);
  }
}

@Module({
  imports: [],
  providers: [NjsNodeRegistryStore],
  controllers: [NodeRegistryController],
  exports: [NjsNodeRegistryStore],
})
export class NodeRegistryModule {}
