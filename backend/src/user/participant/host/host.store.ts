import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Pipeline, Redis } from 'ioredis';

const STREAM_PREFIX = 'stream_';
const HOST_PREFIX = 'host_';
const POSSIBLE_HOST_PREFIX = 'possible_host_';

type HostDTO = {
  id: string;
  stream: string;

  /** false if user has to reconnect and rejoin */
  isJoined: boolean;
};

type Runner = Redis | Pipeline;

const JOINED = 'joined';
const NOT_JOINED = 'not-joined';

type JoinStatus = typeof JOINED | typeof NOT_JOINED;

@Injectable()
export class HostStore implements OnModuleInit {
  redis: Redis;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.config.get('streamHostAddr'));
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

  async setHostJoinedStatus(host: string, joined: boolean) {
    this.redis.hset(host, 'isJoined', joined ? JOINED : NOT_JOINED);
  }

  async setStreamHost(host: string, stream: string) {
    const pipe = this.redis.pipeline();

    pipe.set(STREAM_PREFIX + stream, host);
    pipe.hmset(HOST_PREFIX + host, { stream, isJoined: JOINED });

    return pipe.exec();
  }

  async isHostJoined(host: string) {
    const [, status] = await this.redis.hget(host, 'isJoined');

    return status === JOINED;
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
    const data = await this.redis.hgetall(STREAM_PREFIX + host);

    return {
      id: host,
      stream: data.stream,
      isJoined: data.isJoined === JOINED,
    };
  }
}
