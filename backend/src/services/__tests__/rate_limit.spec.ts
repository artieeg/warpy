import { RateLimit } from "../rate_limit";

describe("RateLimit", () => {
  it("passes the params", () => {
    const fn = jest.fn();

    const rateLimitedFn = RateLimit.withRateLimit(fn, {
      prefix: "test",
      user: "test",
      delay: 1000,
      limit: 1,
    });

    rateLimitedFn(1, 2, 3);

    expect(fn).toBeCalledWith(1, 2, 3);
  });

  it("limits function calls", () => {
    const fn = jest.fn();
    const expectedCallsCount = 4;

    const rateLimitedFn = RateLimit.withRateLimit(fn, {
      prefix: "test",
      user: "test2",
      delay: 1000,
      limit: expectedCallsCount,
    });

    for (let i = 0; i < expectedCallsCount * 2; i++) {
      rateLimitedFn();
    }

    expect(fn).toBeCalledTimes(expectedCallsCount);
  });

  it("runs function again after delay", () => {
    const fn = jest.fn();
    const expectedCallsCount = 4;

    const rateLimitedFn = RateLimit.withRateLimit(fn, {
      prefix: "test",
      user: "test3",
      delay: 1000,
      limit: expectedCallsCount,
    });

    for (let i = 0; i < expectedCallsCount * 2; i++) {
      rateLimitedFn();
    }

    jest.runAllTimers();

    for (let i = 0; i < expectedCallsCount * 2; i++) {
      rateLimitedFn();
    }

    expect(fn).toBeCalledTimes(expectedCallsCount * 2);
  });
});
