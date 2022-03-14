import { Redis } from 'ioredis';

export const VAL_ONLINE = '+';
export const VAL_OFFLINE = '-';

type Status = typeof VAL_OFFLINE | typeof VAL_ONLINE;

export class OnlineStatusStoreBehavior {
  constructor(
    private redis: Redis,
    private PREFIX: string = 'user_online_status_',
  ) {}

  async set(user: string, status: Status) {
    return this.redis.set(this.PREFIX + user, status);
  }

  async getStatusMany(ids: string[]): Promise<boolean[]> {
    const values = (await this.redis.mget(ids)) as Status[];

    return values.map((v) => v === VAL_ONLINE);
  }

  async getStatus(user: string) {
    const v = await this.redis.get(user);

    return !!v;
  }
}
