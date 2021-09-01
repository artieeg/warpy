import { syncClaps } from "../countNewClap";
import { batchedClapUpdates } from "../countNewClap";
import { mocked } from "ts-jest/utils";
import { StreamDAL } from "@backend/dal";
import { onClapsUpdate } from "../observer";

describe("StreamService.syncClaps", () => {
  const stream = "test-stream";
  const claps = 5;

  const mockedStreamDAL = mocked(StreamDAL);

  beforeAll(() => {
    mockedStreamDAL.incClapsCount.mockResolvedValue({ id: stream, claps });
  });

  beforeEach(() => {
    Object.keys(batchedClapUpdates).forEach((key) => {
      delete batchedClapUpdates[key];
    });
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
