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
    const key = this.PREFIX + user;

    if (status === VAL_ONLINE) {
      await this.redis
        .pipeline()
        .set(key, status)
        .persist(key) //reset expire if exists
        .exec();
    } else {
      await this.redis
        .pipeline()
        .set(key, status)
        .expire(key, 60 * 5) //clean up after 5 minutes
        .exec();
    }
  }

  async getStatusMany(ids: string[]): Promise<boolean[]> {
    const values = (await this.redis.mget(ids)) as Status[];

    return values.map((v) => v === VAL_ONLINE);
  }

  async getStatus(user: string) {
    const v = await this.redis.get(user);

    return v === VAL_ONLINE;
  }
}
