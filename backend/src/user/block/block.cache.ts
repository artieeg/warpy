import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient, createClient } from 'redis';

@Injectable()
export class BlockCacheService {
  client: RedisClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = createClient({
      url: this.configService.get('blockCacheAddr'),
    });
  }

  async delBlockedByUsers(id: string) {
    const key = `blocked_by_users_${id}`;

    return new Promise<void>((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async delBlockedUserIds(id: string) {
    const key = `blocked_users_${id}`;

    return new Promise<void>((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async getBlockedUserIds(id: string) {
    const key = `blocked_users_${id}`;

    return new Promise<string[] | undefined>((resolve, reject) => {
      this.client.smembers(key, (err, values) => {
        if (err) reject(err);
        else resolve(values);
      });
    });
  }

  async getBlockedByIds(id: string) {
    const key = `blocked_by_users_${id}`;

    return new Promise<string[] | undefined>((resolve, reject) => {
      this.client.smembers(key, (err, values) => {
        if (err) reject(err);
        else resolve(values);
      });
    });
  }

  async setBlockedUserIds(id: string, ids: string[]) {
    return new Promise<void>((resolve, reject) => {
      const key = `blocked_users_${id}`;

      this.client.sadd(key, ids, (err0) => {
        if (err0) reject(err0);
        else
          this.client.expire(key, 30 * 60, (err1) => {
            if (err1) reject(err1);
            else resolve();
          });
      });
    });
  }

  async setBlockedByIds(id: string, ids: string[]) {
    return new Promise<void>((resolve, reject) => {
      const key = `blocked_by_users_${id}`;

      this.client.sadd(key, ids, (err0) => {
        if (err0) reject(err0);
        else
          this.client.expire(key, 30 * 60, (err1) => {
            if (err1) reject(err1);
            else resolve();
          });
      });
    });
  }
}
