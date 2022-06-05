import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { flatten } from '@warpy-be/utils/redis';
import IORedis from 'ioredis';

type NodeKind = 'send' | 'recv';
type AssignedNodeRecord = Record<NodeKind | undefined, string | undefined>;

/**
 * Stores assigned send/recv node ids to a participant
 * */
@Injectable()
export class ParticipantNodeAssignerStore implements OnModuleInit {
  private redis: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(
      this.configService.get('participantNodeAssignerAddr'),
    );
  }

  async del(user: string) {
    await this.redis.del(user);
  }

  async get(user: string): Promise<AssignedNodeRecord> {
    return this.redis.hgetall(user) as any;
  }

  async set(user: string, data: AssignedNodeRecord) {
    await this.redis.hmset(user, ...flatten(data));
  }
}
