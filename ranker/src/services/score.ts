import redis from "redis";

const URL = process.env.STATS_CACHE || "redis://127.0.0.1:6379/2";

const client = redis.createClient({
  url: URL,
});

export const getHubs = async (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    client.smembers("hubs", (err, hubs) => {
      if (err) {
        return reject(err);
      }

      resolve(hubs);
    });
  });
};

export interface IStats {
  id: string;
  claps: number;
  participants: number;
  started: number;
}

export const getStreamStats = async (streamId: string): Promise<IStats> => {
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

export const getStreamIds = async (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    client.zrangebyscore("main-feed", "-inf", "+inf", (err, ids) => {
      if (err) {
        return reject(err);
      }

      resolve(ids);
    });
  });
};

const setScore = (key: string, streamId: string, score: number) => {
  return new Promise<void>((resolve, reject) => {
    client.zadd(key, "XX", streamId, score, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};

export const setNewScore = async (
  id: string,
  score: number,
  hubs: string[]
) => {
  const promises = hubs.map((hub) => setScore(hub, id, score));

  await Promise.all([setScore("main-feed", id, score), ...promises]);
};
