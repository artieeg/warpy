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

    pipe.set(user, stream);
    pipe.sadd(PREFIX_STREAM + stream, user);

    return pipe.exec();
  }

  async get(user: string) {
    return this.client.get(user);
  }
}
