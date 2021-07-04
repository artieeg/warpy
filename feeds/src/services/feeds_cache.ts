import redis from "redis";
import { promisify } from "util";

const URL = process.env.FEEDS_CACHE || "redis://127.0.0.1:6375/1";

const client = redis.createClient({
  url: URL,
});

//const sadd = promisify(client.sadd).bind(client);
const smembers = promisify(client.smembers).bind(client);

export const connect = () => {};

export const getServedStreams = async (user: string): Promise<string[]> => {
  try {
    return await smembers(user);
  } catch {
    return [];
  }
};

export const addServedStreams = async (
  user: string,
  servedStreams: string[]
) => {
  return new Promise<void>((resolve, reject) => {
    client.sadd(user, servedStreams, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};
