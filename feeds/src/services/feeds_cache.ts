import redis, { RedisClient } from "redis";

let client: RedisClient;

export const connect = () => {
  const URL = process.env.FEEDS_CACHE || "redis://127.0.0.1:6379/1";

  client = redis.createClient({
    url: URL,
  });
};

export const getServedStreams = async (user: string): Promise<string[]> => {
  return [];
};

export const addServedStreams = async (
  user: string,
  servedStreams: string[]
) => {};
