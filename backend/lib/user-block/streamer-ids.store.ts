import IORedis from 'ioredis';

export class StreamerIdStore {
  private redis: IORedis.Redis;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.redis = new IORedis(this.uri);
  }

  async get(stream: string) {
    return this.redis.smembers(stream);
  }

  async add(user: string, stream: string) {
    await this.redis.sadd(stream, user);
  }

  async rem(user: string, stream: string) {
    await this.redis.srem(stream, user);
  }

  async del(stream: string) {
    await this.redis.del(stream);
  }
}
