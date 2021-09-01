import { countNewClap, syncClaps } from "../countNewClap";
import { batchedClapUpdates } from "../countNewClap";
import { mocked } from "ts-jest/utils";
import { StreamDAL } from "@backend/dal";
import { onClapsUpdate } from "../observer";

const user = "test-user";
const stream = "test-stream";
const claps = 5;

describe("syncClaps", () => {
  const mockedStreamDAL = mocked(StreamDAL);

  beforeAll(() => {
    mockedStreamDAL.incClapsCount.mockResolvedValue({ id: stream, claps });
  });

  beforeEach(() => {
    Object.keys(batchedClapUpdates).forEach((key) => {
      delete batchedClapUpdates[key];
    });
  });

  it("cleans up the cached values after sync", async () => {
    batchedClapUpdates[stream] = claps;
    await syncClaps();

    jest.runOnlyPendingTimers();

    expect(batchedClapUpdates).toEqual({});
  });

  it("updates the db", async () => {
    batchedClapUpdates[stream] = claps;
    await syncClaps();

    jest.runOnlyPendingTimers();

    expect(mockedStreamDAL.incClapsCount).toBeCalledWith(stream, claps);
  });

  it("emits events with updated claps counts", async () => {
    batchedClapUpdates[stream] = claps;
    const cb = jest.fn();

    onClapsUpdate(cb);

    await syncClaps();

    expect(cb).toBeCalled();
    expect(cb).toBeCalledWith({ id: stream, claps });
  });
});

describe("StreamService.countNewClap", () => {
  beforeEach(() => {
    Object.keys(batchedClapUpdates).forEach((key) => {
      delete batchedClapUpdates[key];
    });
  });

  it("creates a new entry", () => {
    countNewClap(user, stream);

    expect(batchedClapUpdates).toHaveProperty(stream);
    expect(batchedClapUpdates[stream]).toEqual(1);
  });

  it("updates existing entry", () => {
    batchedClapUpdates[stream] = 4;

    countNewClap(user, stream);

    expect(batchedClapUpdates[stream]).toEqual(5);
  });
});
