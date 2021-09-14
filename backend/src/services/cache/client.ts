import { createClient } from "redis";

const URL = process.env.FEEDS_CACHE || "redis://127.0.0.1:6375/1";

const client = createClient({
  url: URL,
});

type ValueParser<T> = (value: string) => T;

export function get<T>(key: string, parse?: ValueParser<T>): Promise<T | null> {
  return new Promise((resolve, reject) => {
    client.get(key, (err, value) => {
      if (err) {
        return reject(err);
      }

      if (!value) {
        return resolve(null);
      }

      resolve(parse ? parse(value) : (value as unknown as T));
    });
  });
}

function expire(key: string, expiry: number): Promise<void> {
  return new Promise((resolve, reject) => {
    client.expire(key, expiry, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function set(key: string, value: any, expiry: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    client.set(key, JSON.stringify(value), async (err) => {
      if (err) {
        return reject(err);
      }

      try {
        await expire(key, expiry);
      } catch (e) {
        return reject(e);
      }

      resolve();
    });
  });
}
