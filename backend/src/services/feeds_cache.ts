import redis from "redis";
import { promisify } from "util";
import { MessageService } from ".";

const URL = process.env.FEEDS_CACHE || "redis://127.0.0.1:6375/1";

const client = redis.createClient({
  url: URL,
});

//const sadd = promisify(client.sadd).bind(client);
const smembers = promisify(client.smembers).bind(client);

export const init = () => {
  MessageService.on("user-disconnected", (data: any) => {
    const { user } = data;

    removeServedStreams(user);
  });
};

export const getServedStreams = async (user: string): Promise<string[]> => {
  try {
    return await smembers(user);
  } catch {
    return [];
  }
};

const addServedStream = async (user: string, streamId: string) => {
  return new Promise<void>((resolve, reject) => {
    client.sadd(user, streamId, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

export const addServedStreams = async (
  user: string,
  servedStreams: string[]
) => {
  const promises = servedStreams.map((id) => addServedStream(user, id));

  await Promise.all(promises);
};

export const removeServedStreams = async (user: string) => {
  client.del(user);
};
