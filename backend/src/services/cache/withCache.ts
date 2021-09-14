import { get, set } from "./client";
export const cache: any = {};

type ArgumentKeyExtractor<T> = (args: T) => string;

const defaultKeyExtractor = (args: any) => {
  return JSON.stringify(args);
};

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;

type CachedFunction<F extends BaseFn> = (
  ...args: ArgumentTypes<F>
) => Promise<ReturnType<F>>;

type BaseFn = (...args: any[]) => any;

type CacheParams<F extends BaseFn> = {
  /** Specify a function that returns a string value for key from the args array */
  keyExtractor?: ArgumentKeyExtractor<ArgumentTypes<F>>;
  /** Specify a key prefix */
  prefix?: string;

  /** Expire value from cache after n seconds, default 60 */
  expiry?: number;
};

export function withCache<F extends BaseFn>(
  fn: F,
  params?: CacheParams<F>
): CachedFunction<F> {
  return async (...args) => {
    const keyExtractor = params?.keyExtractor || defaultKeyExtractor;

    const expiry = params?.expiry || 60;

    let key = keyExtractor(args);
    if (params?.prefix) {
      key = params.prefix + "_" + key;
    }

    const cachedValue = await get(key);

    if (cachedValue) {
      return cachedValue;
    }

    const value = await fn(...args);
    await set(key, value, expiry);

    return value;
  };
}
