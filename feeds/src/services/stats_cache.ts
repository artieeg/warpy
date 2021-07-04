import redis, { RedisClient } from "redis";

let client: RedisClient;

export const connect = () => {
  const URL = process.env.STATS_CACHE || "redis://127.0.0.1:6379/2";

  client = redis.createClient({
    url: URL,
  });
};

export const createStats = async (streamId: string) => {
  //TODO: implement
};
