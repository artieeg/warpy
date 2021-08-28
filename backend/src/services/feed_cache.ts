import redis from "redis";
import { promisify } from "util";

const URL = process.env.FEEDS_CACHE || "redis://127.0.0.1:6375/1";

const client = redis.createClient({
  url: URL,
});

//const sadd = promisify(client.sadd).bind(client);
const smembers = promisify(client.smembers).bind(client);

export const FeedCacheService = {
  async getServedStreams(user: string): Promise<string[]> {
    try {
      return await smembers(user);
    } catch {
      return [];
    }
  },

  async addServedStream(user: string, streamId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      client.sadd(user, streamId, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  },

  async addServedStreams(user: string, servedStreams: string[]): Promise<void> {
    const promises = servedStreams.map((id) =>
      FeedCacheService.addServedStream(user, id)
    );

    await Promise.all(promises);
  },

  async removeServedStreams(user: string): Promise<void> {
    client.del(user);
  },
};
