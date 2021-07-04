import { IStats } from "@app/models";
import redis from "redis";

const URL = process.env.STATS_CACHE || "redis://127.0.0.1:6379/2";

const client = redis.createClient({
  url: URL,
});

//const zadd = promisify(client.zadd).bind(this);

export const connect = () => {};

const addScore = async (streamId: string) => {
  return new Promise<void>((resolve) => {
    client.zadd("scores", "NX", 0, streamId);

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
export const createStats = async (streamId: string) => {
  return Promise.all([addScore(streamId), initCandidateStats(streamId)]);
};

/*
 * Returns sorted by score stream ids from Redis sorted set
 */
export const getSortedStreamIds = async (hub?: string): Promise<string[]> => {
  return [];
};
