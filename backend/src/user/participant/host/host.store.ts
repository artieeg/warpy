import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OnlineStatusStoreBehavior,
  VAL_OFFLINE,
  VAL_ONLINE,
} from '@warpy-be/shared';
import IORedis, { Redis } from 'ioredis';

const STREAM_PREFIX = 'stream_';
const HOST_PREFIX = 'stream_';

@Injectable()
export class HostStore implements OnModuleInit {
  redis: Redis;
  hostOnlineStatus: OnlineStatusStoreBehavior;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.config.get('streamHostAddr'));
    this.hostOnlineStatus = new OnlineStatusStoreBehavior(this.redis);
  }

  async setStreamHostOnlineStatus(host: string, online: boolean) {
    return this.hostOnlineStatus.set(host, online ? VAL_ONLINE : VAL_OFFLINE);
  }

  async isHostOnline(host: string) {
    return this.hostOnlineStatus.getStatus(host);
  }

  async setStreamHost(host: string, stream: string) {
    const pipe = this.redis.pipeline();

    pipe.set(HOST_PREFIX + host, stream);
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

  async getStreamByHost(host: string): Promise<string | null> {
    const [, value] = await this.redis.get(host);

    return value;
  }
}
