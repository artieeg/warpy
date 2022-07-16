import { Injectable, OnModuleInit, Controller, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';
import IORedis from 'ioredis';
import { NodeInfoStore } from 'lib';
import { IMediaNodeInfoRequest, MediaServiceRole } from '@warpy/lib';

@Injectable()
export class NjsNodeInfoStore extends NodeInfoStore implements OnModuleInit {
  client: IORedis.Redis;

  constructor(configService: ConfigService) {
    super(configService.get('mediaNodeInfo'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

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

@Module({
  imports: [],
  providers: [NjsNodeInfoStore],
  controllers: [NodeInfoController],
  exports: [NjsNodeInfoStore],
})
export class NodeInfoModule {}
