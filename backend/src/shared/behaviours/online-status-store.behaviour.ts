import { Pipeline, Redis } from 'ioredis';

export const VAL_ONLINE = 'online';
export const VAL_OFFLINE = 'offline';

type Status = typeof VAL_OFFLINE | typeof VAL_ONLINE;

export class OnlineStatusStoreBehavior {
  constructor(
    private redis: Redis,
    private PREFIX: string = 'user_online_status_',
  ) {}

  async set(
    user: string,
    status: Status,
    pipeline: Pipeline = this.redis.pipeline(),
  ) {
    const key = this.PREFIX + user;

    if (status === VAL_ONLINE) {
      await pipeline
        .set(key, status)
        .persist(key) //reset expire if exists
        .exec();
    } else {
      await pipeline
        .set(key, status)
        .expire(key, 60 * 5) //clean up after 5 minutes
        .exec();
    }
  }

  async getStatusMany(ids: string[]): Promise<boolean[]> {
    const values = (await this.redis.mget(ids)) as Status[];

    return values.map((v) => v === VAL_ONLINE);
  }

  async get(user: string, pipeline?: Pipeline) {
    const key = this.PREFIX + user;

    if (pipeline) {
      return pipeline.get(key);
    } else {
      return this.getStatus(user);
    }
  }

  async getStatus(user: string) {
    const v = await this.redis.get(this.PREFIX + user);

    return v === VAL_ONLINE;
  }
}
