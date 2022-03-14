import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';

const STREAM_PREFIX = 'stream_';
const HOST_PREFIX = 'stream_';

type HostDTO = {
  stream: string;
  status: 'online' | 'offline';
};

@Injectable()
export class HostStore implements OnModuleInit {
  redis: Redis;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.config.get('streamHostAddr'));
  }

  private toDTO(data: any): HostDTO {
    return {
      stream: data.stream,
      status: data.status,
    };
  }

  async setHostStatus(host: string, status: 'online' | 'offline') {
    const data = await this.getHostData(host);

    if (!data) {
      return;
    }

    return this.redis.hset(host, 'status', status);
  }

  async setStreamHost(host: string, stream: string) {
    const pipe = this.redis.pipeline();

    pipe.hmset(HOST_PREFIX + host, { stream, status: 'online' });
    pipe.set(STREAM_PREFIX + stream, host);

    return pipe.exec();
  }

  private del(stream: string, host: string) {
    const pipe = this.redis
      .pipeline()
      .del(HOST_PREFIX + host)
      .del(STREAM_PREFIX + stream);

    return pipe.exec();
  }

  async getHostData(host: string) {
    const data = await this.redis.hgetall(host);

    if (!data || !data.stream || !data.online) {
      return undefined;
    }

    return this.toDTO(data);
  }

  async delByStream(stream: string) {
    const [, host] = await this.redis.get(STREAM_PREFIX + stream);

    if (!host) {
      return;
    }

    return this.del(stream, host);
  }

  async delByHost(host: string) {
    const stream = await this.getStreamByHost(host);

    if (!stream) {
      return;
    }

    return this.del(stream, host);
  }

  async getStreamByHost(host: string) {
    const [, value] = await this.redis.hget(host, 'stream');

    return value as string | null;
  }
}
