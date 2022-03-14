import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';

const STREAM_PREFIX = 'stream_';
const HOST_PREFIX = 'stream_';

@Injectable()
export class HostStore implements OnModuleInit {
  redis: Redis;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.config.get('streamHostAddr'));
  }

  async setStreamHost(host: string, stream: string) {
    const pipe = this.redis.pipeline();

    pipe.set(HOST_PREFIX + host, stream);
    pipe.set(STREAM_PREFIX + stream, host);

    return pipe.exec();
  }

  async delByStream(host: string) {
    const stream = await this.getStreamByHost(host);

    const pipe = this.redis.pipeline();
    pipe.del(HOST_PREFIX + host);
    pipe.del(STREAM_PREFIX + stream);

    return pipe.exec();
  }

  async delByHost(host: string) {
    const stream = await this.getStreamByHost(host);

    const pipe = this.redis.pipeline();
    pipe.del(HOST_PREFIX + host);
    pipe.del(STREAM_PREFIX + stream);

    return pipe.exec();
  }

  async getStreamByHost(host: string) {
    const [, value] = await this.redis.get(host);

    return value as string;
  }
}
