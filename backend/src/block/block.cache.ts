import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';
import { UserBlockCacheStore } from 'lib/stores';

@Injectable()
export class NjsBlockCacheStore extends UserBlockCacheStore {
  client: IORedis.Redis;

  constructor(configService: ConfigService) {
    super(configService.get('blockCacheAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
