import redis from "redis";

const URL = process.env.STATS_CACHE || "redis://127.0.0.1:6379/2";

const client = redis.createClient({
  url: URL,
});

//const zadd = promisify(client.zadd).bind(this);

export const connect = () => {};

const addScore = async (streamId: string, hub?: string) => {
  return new Promise<void>((resolve) => {
    client.zadd("main-feed", "NX", 0, streamId);

    if (hub) {
      client.zadd(hub, "NX", 0, streamId);
    }

    resolve();
  });
};

const initCandidateStats = async (streamId: string) => {
  return new Promise<void>((resolve, reject) => {
    client.sadd(streamId, "0", "0", (err) => {
      if (err) {
        reject(err);
      }
    });

    resolve();
  });
};

/**
 * Initialize stats for candidate
 */
export const createStats = async (streamId: string, hub?: string) => {
  return Promise.all([addScore(streamId, hub), initCandidateStats(streamId)]);
};

/*
 * Returns sorted by score stream ids from Redis sorted set
 */
export const getSortedStreamIds = async (hub?: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const key = hub || "scores";

    client.zrangebyscore(key, 0, 1, (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
};
