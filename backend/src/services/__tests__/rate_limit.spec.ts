import { RateLimit } from "../rate_limit";

describe("RateLimit", () => {
  it("limits function calls", () => {
    const fn = jest.fn();
    const expectedCallsCount = 4;

    const rateLimitedFn = RateLimit.withRateLimit(fn, {
      prefix: "test",
      user: "test",
      delay: 1000,
      limit: expectedCallsCount,
    });

    for (let i = 0; i < expectedCallsCount * 2; i++) {
      rateLimitedFn();
    }

    expect(fn).toBeCalledTimes(expectedCallsCount);
  });

  it.todo("runs function again after delay");
});
