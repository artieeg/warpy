import { flatten } from '@warpy-be/utils/redis';
import IORedis from 'ioredis';
import { OnInstanceInit } from 'lib/OnInstanceInit.interface';

type NodeKind = 'send' | 'recv';
type AssignedNodeRecord = Record<NodeKind | undefined, string | undefined>;

export interface IParticipantNodeAssignerStore extends OnInstanceInit {
  del(user: string): Promise<void>;
  get(user: string): Promise<AssignedNodeRecord>;
  set(user: string, data: AssignedNodeRecord): Promise<void>;
}

/**
 * Stores assigned send/recv node ids to a participant
 * */
export class ParticipantNodeAssignerStore
  implements IParticipantNodeAssignerStore
{
  private redis: IORedis.Redis;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.redis = new IORedis(this.uri);
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
