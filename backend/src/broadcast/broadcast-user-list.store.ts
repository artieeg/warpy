import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Injectable()
export class BroadcastUserListStore implements OnModuleInit {
  redis: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(
      this.configService.get('broadcastUserListStoreAddr'),
    );
  }

  async addUserToList(list: string, user: string) {
    return this.redis.sadd(list, user);
  }

  async removeUserFromList(list: string, user: string) {
    return this.redis.srem(list, user);
  }

  async deleteList(list: string) {
    return this.redis.del(list);
  }

  async get(list: string): Promise<string[]> {
    return this.redis.smembers(list);
  }
}
