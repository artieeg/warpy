type RateLimitConfig = {
  prefix: string;
  limit: number;
  user: string;
  delay: number;
};

type RateLimitData = {
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  timeout?: any;
  count: number;
};

const data: Record<string, RateLimitData> = {};

const withRateLimit = (
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  fn: any,
  { user, delay, limit, prefix }: RateLimitConfig
) => {
  return (): void => {
    const key = `${prefix}_${user}`;
    let record = data[key];

    if (!record) {
      data[key] = record = {
        count: 0,
      };
    }

    if (record.count >= limit) {
      return;
    }

    record.count++;

    if (!record.timeout) {
      record.timeout = setTimeout(() => {
        record.count = 0;
        record.timeout = undefined;
      }, delay);
    }

    fn();
  };
};

export const RateLimit = {
  withRateLimit,
};
