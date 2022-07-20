import IORedis from 'ioredis';
import { OnInstanceInit } from 'lib/OnInstanceInit.interface';

export interface IUserBlockCacheStore extends OnInstanceInit {
  delBlockedByUsers(id: string): Promise<void>;
  delBlockedUserIds(id: string): Promise<void>;
  getBlockedUserIds(id: string): Promise<string[]>;
  getBlockedByIds(id: string): Promise<string[]>;
  setBlockedUserIds(id: string, ids: string[]): Promise<void>;
  setBlockedByIds(id: string, ids: string[]): Promise<void>;
}

export class UserBlockCacheStore implements IUserBlockCacheStore {
  client: IORedis.Redis;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.client = new IORedis(this.uri);
  }

  async delBlockedByUsers(id: string) {
    const key = `blocked_by_users_${id}`;

    await this.client.del(key);
  }

  async delBlockedUserIds(id: string) {
    const key = `blocked_users_${id}`;

    await this.client.del(key);
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
    await pipe.exec();
  }

  async setBlockedByIds(id: string, ids: string[]) {
    const key = `blocked_by_users_${id}`;

    const pipe = this.client.pipeline();

    pipe.sadd(key, ids);
    pipe.expire(key, 30 * 60);

    await pipe.exec();
  }
}
