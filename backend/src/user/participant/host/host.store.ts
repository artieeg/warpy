import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';
import { IFullParticipant } from '..';
import { ParticipantStore } from '../store';

const STREAM_PREFIX = 'stream_';
const HOST_PREFIX = 'host_';
const PREFIX_POSSIBLE_HOST = 'possible_host_';
const PREFIX_USER_INFO = 'user_info_';

const JOINED = 'joined';
const NOT_JOINED = 'not-joined';

@Injectable()
export class HostStore implements OnModuleInit {
  redis: Redis;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.config.get('streamHostAddr'));
  }

  async getRandomPossibleHost(
    stream: string,
  ): Promise<IFullParticipant | null> {
    const id = await this.redis.srandmember(PREFIX_POSSIBLE_HOST + stream);
    const host = await this.getHostInfo(id);

    return host;
  }

  async addPossibleHost(host: IFullParticipant) {
    const { id, stream } = host;

    this.redis
      .pipeline()
      .sadd(PREFIX_POSSIBLE_HOST + stream, id)
      .hmset(PREFIX_POSSIBLE_HOST, host)
      .exec();
  }

  async delPossibleHost(host: IFullParticipant) {
    const { id, stream } = host;

    this.redis
      .pipeline()
      .srem(PREFIX_POSSIBLE_HOST + stream, id)
      .del(PREFIX_USER_INFO + id)
      .exec();
  }

  async setHostJoinedStatus(host: string, joined: boolean) {
    this.redis.hset(
      HOST_PREFIX + host,
      'isJoined',
      joined ? JOINED : NOT_JOINED,
    );
  }

  async setStreamHost(host: string, stream: string) {
    const pipe = this.redis.pipeline();

    pipe.set(STREAM_PREFIX + stream, host);
    pipe.hmset(HOST_PREFIX + host, { stream, isJoined: JOINED });

    return pipe.exec();
  }

  async isHostJoined(host: string) {
    const status = await this.redis.hget(host, 'isJoined');

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
    const host = await this.redis.get(STREAM_PREFIX + stream);

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

  async getHostInfo(host: string): Promise<IFullParticipant | null> {
    const data = await this.redis.hgetall(PREFIX_USER_INFO + host);

    if (!data) {
      return null;
    }

    return ParticipantStore.toDTO(data);
  }
}
