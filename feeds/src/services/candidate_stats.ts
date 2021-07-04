import { IStats } from "@app/models";
import redis from "redis";

const URL = process.env.STATS_CACHE || "redis://127.0.0.1:6379/2";

const client = redis.createClient({
  url: URL,
});

//const zadd = promisify(client.zadd).bind(this);

export const connect = () => {};

export const updateScore = async (
  streamId: string,
  score: number,
  hub?: string
) => {
  return new Promise<void>((resolve) => {
    client.zadd("main-feed", "XX", score, streamId);

    if (hub) {
      client.zadd(hub, "XX", score, streamId);
    }

    resolve();
  });
};

export const addHub = async (hub?: string) => {
  return new Promise<void>((resolve) => {
    if (hub) {
      client.sadd("hubs", hub, () => {
        resolve();
      });
    } else {
      resolve();
    }
  });
};

export const addScore = async (streamId: string, hub?: string) => {
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
    const claps = "0";
    const participants = "0";
    const started = (Date.now() / 1000).toString();
    client.sadd(streamId, claps, participants, started, (err) => {
      if (err) {
        reject(err);
      }
    });

    resolve();
  });
};

export const getStats = async (streamId: string): Promise<IStats> => {
  return new Promise((resolve, reject) => {
    client.smembers(streamId, (err, [claps, participants, started]) => {
      if (err) {
        reject(err);
      }

      const stats: IStats = {
        claps: Number.parseInt(claps),
        participants: Number.parseInt(participants),
        started: Number.parseInt(started),
        id: streamId,
      };

      resolve(stats);
    });
  });
};

/**
 * Initialize stats for candidate
 */
export const createStats = async (streamId: string, hub?: string) => {
  return Promise.all([
    addScore(streamId, hub),
    initCandidateStats(streamId),
    addHub(hub),
  ]);
};

/*
 * Returns sorted by score stream ids from Redis sorted set
 */
export const getSortedStreamIds = async (hub?: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const key = hub || "scores";

    client.zrangebyscore(key, 0, "+inf", (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
};
