import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';
import { NodeInfoStore } from 'lib/stores';

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
