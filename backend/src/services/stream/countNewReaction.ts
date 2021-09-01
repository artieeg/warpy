import { StreamDAL } from "@backend/dal";
import { Reaction } from "@warpy/lib";
import { observer } from "./observer";

/**
 * Stores pending reaction updates;
 */
export const batchedReactionUpdates: Record<string, Reaction[]> = {};

const reset = () => {
  Object.keys(batchedReactionUpdates).forEach((key) => {
    batchedReactionUpdates[key] = [];
  });
};

export const syncReactions = async (): Promise<void> => {
  Object.entries(batchedReactionUpdates).forEach(([stream, reactions]) => {
    StreamDAL.incClapsCount(stream, reactions.length);
    observer.emit("reactions-update", { stream, reactions });
  });

  reset();
};

export const runReactionSync = (): void => {
  setInterval(syncReactions, 1000);
};

const ALLOWED_EMOJI = ["1f47e"];

export const countNewReaction = async (
  user: string,
  emoji: string,
  stream: string
): Promise<void> => {
  if (!ALLOWED_EMOJI.includes(emoji)) {
    return;
  }

  if (!batchedReactionUpdates[stream]) {
    batchedReactionUpdates[stream] = [{ emoji, user }];
  } else {
    batchedReactionUpdates[stream].push({ emoji, user });
  }
};
