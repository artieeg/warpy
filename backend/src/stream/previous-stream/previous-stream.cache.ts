import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

const PREFIX_STREAM = 'stream_';

@Injectable()
export class PreviousStreamCacheService {
  client: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new IORedis(
      this.configService.get('previousStreamCacheAddr'),
    );
  }

  async delStream(stream: string) {
    const ids = await this.client.smembers(PREFIX_STREAM + stream);

    if (ids.length > 0) {
      this.client.del(...ids, PREFIX_STREAM + stream);
    }
  }

  async expire(user: string) {
    return this.client.expire(user, 5 * 60);
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

    return pipe.exec();
  }

  async get(user: string) {
    return this.client.get(user);
  }
}
