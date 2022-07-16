import IORedis fro 'ioredis';
import { OnInstanceInit } from 'lib/OnInstanceInit.interface';

const PREFIX_STREAM = 'stream_';

export interface IPreviousStreamStore extends OnInstanceInit {
  delStream(stream: string): Promise<void>;
  expire(user: string): Promise<void>;
  set(user: string, stream: string): Promise<void>;
  get(user: string): Promise<string>;
}

export class PreviousStreamStore implements IPreviousStreamStore {
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
