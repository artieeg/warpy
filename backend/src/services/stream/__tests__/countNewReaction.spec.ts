import { countNewReaction, syncReactions } from "../countNewReaction";
import { batchedReactionUpdates } from "../countNewReaction";
import { mocked } from "ts-jest/utils";
import { StreamDAL } from "@backend/dal";
import { onReactionUpdate } from "../observer";

const user = "test-user";
const stream = "test-stream";
const emoji = "1f47e";
const reaction = {
  user,
  emoji,
};
const reactions = [reaction];

describe("syncReactions", () => {
  const mockedStreamDAL = mocked(StreamDAL);

  beforeAll(() => {
    mockedStreamDAL.incReactionsCount.mockResolvedValue({
      id: stream,
      reactions: 5,
    });
  });

  beforeEach(() => {
    Object.keys(batchedReactionUpdates).forEach((key) => {
      delete batchedReactionUpdates[key];
    });
  });

  it("cleans up the cached values after sync", async () => {
    batchedReactionUpdates[stream] = reactions;
    await syncReactions();

    jest.runOnlyPendingTimers();

    expect(batchedReactionUpdates).toEqual({ [stream]: [] });
  });

  it("updates the db", async () => {
    batchedReactionUpdates[stream] = reactions;
    await syncReactions();

    jest.runOnlyPendingTimers();

    expect(mockedStreamDAL.incReactionsCount).toBeCalledWith(
      stream,
      reactions.length
    );
  });

  it("emits events with updated claps counts", async () => {
    batchedReactionUpdates[stream] = reactions;
    const cb = jest.fn();

    onReactionUpdate(cb);

    await syncReactions();

    expect(cb).toBeCalled();
    expect(cb).toBeCalledWith({ stream, reactions });
  });
});

describe("StreamService.countNewReaction", () => {
  beforeEach(() => {
    Object.keys(batchedReactionUpdates).forEach((key) => {
      delete batchedReactionUpdates[key];
    });
  });

  it("creates a new entry", () => {
    countNewReaction(user, emoji, stream);

    expect(batchedReactionUpdates).toHaveProperty(stream);
    expect(batchedReactionUpdates[stream]).toEqual(reactions);
  });

  it("updates existing entry", () => {
    batchedReactionUpdates[stream] = [];

    countNewReaction(user, emoji, stream);

    expect(batchedReactionUpdates[stream]).toEqual(reactions);
  });
});
