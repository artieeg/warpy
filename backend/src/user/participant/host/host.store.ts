import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OnlineStatusStoreBehavior,
  VAL_OFFLINE,
  VAL_ONLINE,
} from '@warpy-be/shared';
import IORedis, { Pipeline, Redis } from 'ioredis';

const STREAM_PREFIX = 'stream_';
const HOST_PREFIX = 'host_';
const POSSIBLE_HOST_PREFIX = 'possible_host_';

type HostDTO = { id: string; stream: string; online: boolean };
type Runner = Redis | Pipeline;

@Injectable()
export class HostStore implements OnModuleInit {
  redis: Redis;
  hostOnlineStatus: OnlineStatusStoreBehavior;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.config.get('streamHostAddr'));
    this.hostOnlineStatus = new OnlineStatusStoreBehavior(this.redis);
  }

  async getRandomPossibleHost(stream: string) {
    const [, host] = await this.redis.srandmember(stream);

    return host as string | null;
  }

  async addPossibleHost(
    stream: string,
    host: string,
    runner: Runner = this.redis,
  ) {
    return runner.sadd(POSSIBLE_HOST_PREFIX + stream, host);
  }

  async delPossibleHost(
    stream: string,
    host: string,
    runner: Runner = this.redis,
  ) {
    return runner.srem(POSSIBLE_HOST_PREFIX + stream, host);
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
    const { stream } = await this.getHostInfo(host);

    if (!stream) {
      return;
    }

    return this.del(stream, host);
  }

  async getHostInfo(host: string): Promise<HostDTO | null> {
    const pipe = this.redis.pipeline();

    pipe.get(STREAM_PREFIX + host);
    this.hostOnlineStatus.get(host, pipe);

    const [[, stream], [, online]] = await pipe.exec();

    return {
      id: host,
      stream,
      online: online === VAL_ONLINE,
    };
  }
}
