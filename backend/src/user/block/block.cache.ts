import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Injectable()
export class BlockCacheService {
  client: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new IORedis(this.configService.get('blockCacheAddr'));
  }

  async delBlockedByUsers(id: string) {
    const key = `blocked_by_users_${id}`;

    return this.client.del(key);
  }

  async delBlockedUserIds(id: string) {
    const key = `blocked_users_${id}`;

    return this.client.del(key);
  }

  async getBlockedUserIds(id: string) {
    const key = `blocked_users_${id}`;

    return this.client.smembers(key);
  }

  async getBlockedByIds(id: string) {
    const key = `blocked_by_users_${id}`;

    return this.client.smembers(key);
  }

  async setBlockedUserIds(id: string, ids: string[]) {
    const key = `blocked_users_${id}`;

    const pipe = this.client.pipeline();
    pipe.sadd(key, ids);
    pipe.expire(key, 30 * 60);
    return pipe.exec();
  }

  async setBlockedByIds(id: string, ids: string[]) {
    const key = `blocked_by_users_${id}`;

    const pipe = this.client.pipeline();

    pipe.sadd(key, ids);
    pipe.expire(key, 30 * 60);

    return pipe.exec();
  }
}
