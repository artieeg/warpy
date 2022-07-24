import IORedis from 'ioredis';

const PREFIX_STREAM = 'stream_';

export class PreviousStreamStore {
  private client: IORedis.Redis;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.client = new IORedis(this.uri);
  }

  async delStream(stream: string) {
    const ids = await this.client.smembers(PREFIX_STREAM + stream);

    if (ids.length > 0) {
      this.client.del(...ids, PREFIX_STREAM + stream);
    }
  }

  async expire(user: string) {
    await this.client.expire(user, 5 * 60);
  }

  async set(user: string, stream: string) {
    const pipe = this.client.pipeline();

    //remove user from old stream index (if exists)
    const oldPrevStreamValue = await this.get(user);
    if (oldPrevStreamValue) {
      pipe.srem(PREFIX_STREAM + oldPrevStreamValue, user);
    }

    pipe.set(user, stream);
    pipe.sadd(PREFIX_STREAM + stream, user);

    await pipe.exec();
  }

  async get(user: string) {
    return this.client.get(user);
  }
}
