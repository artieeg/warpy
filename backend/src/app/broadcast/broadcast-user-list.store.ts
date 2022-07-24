import IORedis from 'ioredis';

const PREFIX = 'broadcast_list_';

export class BroadcastUserListStore {
  private redis: IORedis.Redis;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.redis = new IORedis(this.uri);
  }

  async addUserToList(list: string, user: string) {
    return this.redis.sadd(PREFIX + list, user);
  }

  async removeUserFromList(list: string, user: string) {
    return this.redis.srem(PREFIX + list, user);
  }

  async deleteList(list: string) {
    return this.redis.del(PREFIX + list);
  }

  async get(list: string): Promise<string[]> {
    return this.redis.smembers(PREFIX + list);
  }
}
