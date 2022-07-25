import IORedis from 'ioredis';

export class UserBlockCacheStore {
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
