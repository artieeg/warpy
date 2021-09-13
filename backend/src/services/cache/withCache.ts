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
  keyExtractor?: ArgumentKeyExtractor<ArgumentTypes<F>>;
};

export function withCache<F extends BaseFn>(
  fn: F,
  params?: CacheParams<F>
): CachedFunction<F> {
  return async (...args) => {
    const keyExtractor = params?.keyExtractor
      ? params.keyExtractor
      : defaultKeyExtractor;

    const key = keyExtractor(args);

    const cachedValue = await get(key);

    if (cachedValue) {
      return cachedValue;
    }

    const value = await fn(...args);
    await set(key, value);

    return value;
  };
}
