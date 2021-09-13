const { CacheService } = jest.requireActual("../cache");
import { mocked } from "ts-jest/utils";
import { set, get } from "../cache/client";

describe("Cache Service", () => {
  const mockedSet = mocked(set);
  const mockedGet = mocked(get);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("wraps a function with cache", async () => {
    const fnToCache = jest
      .fn()
      .mockImplementation((a: number, b: number) => Math.pow(a, b));

    mockedGet.mockResolvedValue(null);

    const cachedFn = CacheService.withCache(fnToCache);

    const args = [1, 4];

    await cachedFn(...args);

    const defaultGeneratedKey = JSON.stringify(args);

    expect(mockedGet).toBeCalledWith(defaultGeneratedKey);
    expect(mockedSet).toBeCalledWith(defaultGeneratedKey, fnToCache(...args));
  });

  it("wraps a function with cache with a custom key extractor", async () => {
    const getUser = jest
      .fn()
      .mockImplementation(async (id: string, includeDetails: boolean) => {
        const user = { id, name: "test-name" };

        if (includeDetails) {
          return { ...user, last_name: "test", first_name: test };
        }
      });

    const cachedGetUser = CacheService.withCache(getUser, {
      keyExtractor: (args: any[]) => args[0],
    });

    const id = "test-id";

    await cachedGetUser(id, false);

    expect(mockedGet).toBeCalledWith(id);
  });
});
