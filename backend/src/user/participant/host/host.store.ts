import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';
import { IFullParticipant } from '..';
import { IParticipant } from '../../../../../lib';
import { ParticipantStore } from '../store';

const STREAM_PREFIX = 'stream_';
const PREFIX_HOST_JOIN_STATUS = 'host_';
const PREFIX_POSSIBLE_HOST = 'possible_host_';
const PREFIX_USER_INFO = 'user_info_';
const PREFIX_HOSTED_STREAMS = 'stream_hosted_by_';

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

  async getHostId(stream: string): Promise<string | undefined> {
    const id = await this.redis.get(STREAM_PREFIX + stream);

    return id;
  }

  async addPossibleHost(host: IFullParticipant) {
    const { id, stream } = host;

    this.redis
      .pipeline()
      .sadd(PREFIX_POSSIBLE_HOST + stream, id)
      .hmset(PREFIX_USER_INFO + id, host)
      .exec();
  }

  async delPossibleHost(user: string, stream: string) {
    this.redis
      .pipeline()
      .srem(PREFIX_POSSIBLE_HOST + stream, user)
      .del(PREFIX_USER_INFO + user)
      .exec();
  }

  async isHostJoined(host: string) {
    const value = await this.redis.get(PREFIX_HOST_JOIN_STATUS + host);
    return value === JOINED;
  }

  async setHostJoinedStatus(host: string, joined: boolean) {
    return this.redis.set(
      PREFIX_HOST_JOIN_STATUS + host,
      joined ? JOINED : NOT_JOINED,
    );
  }

  async getHostedStreamId(user: string): Promise<string | undefined> {
    return this.redis.get(PREFIX_HOSTED_STREAMS + user);
  }

  async setStreamHost(participant: IParticipant) {
    const { id, stream } = participant;

    return this.redis
      .pipeline()
      .set(STREAM_PREFIX + stream, id)
      .hmset(PREFIX_USER_INFO + id, participant)
      .set(PREFIX_HOSTED_STREAMS + id, stream)
      .set(PREFIX_HOST_JOIN_STATUS + id, JOINED)
      .exec();
  }

  private del(stream: string, host: string) {
    const pipe = this.redis
      .pipeline()
      .del(PREFIX_HOST_JOIN_STATUS + host)
      .del(PREFIX_USER_INFO + host)
      .del(PREFIX_HOST_JOIN_STATUS + host)
      .del(PREFIX_HOSTED_STREAMS + host)
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

    if (!data.id) {
      return null;
    }

    return ParticipantStore.toDTO(data);
  }
}
