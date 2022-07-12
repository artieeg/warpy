import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';
import { StreamNodeAssignerStore } from 'lib/stores';

/**
 * Stores arrays of nodes, where the stream "lives"
 * */
@Injectable()
export class StreamNodeAssignerService
  extends StreamNodeAssignerStore
  implements OnModuleInit
{
  client: IORedis.Redis;

  constructor(configService: ConfigService) {
    super(configService.get('mediaStreamNodeAssigner'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
