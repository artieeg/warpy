import { StreamDAL } from "@backend/dal";
import { Reaction, ALLOWED_EMOJI } from "@warpy/lib";
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
  Object.entries(batchedReactionUpdates).forEach(
    async ([stream, reactions]) => {
      try {
        observer.emit("reactions-update", { stream, reactions });
        await StreamDAL.incReactionsCount(stream, reactions.length);
      } catch (e) {
        console.error(e);
      }
    }
  );

  reset();
};

export const runReactionSync = (): void => {
  setInterval(syncReactions, 1000);
};

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
