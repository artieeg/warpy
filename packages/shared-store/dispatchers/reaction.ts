import { container } from "../container";
import { StoreDispatcherSlice } from "../types";

export interface IReactionDispatchers {
  dispatchReactionChange: (reaction: string) => void;
}

export const createReactionDispatchers: StoreDispatcherSlice<IReactionDispatchers> =
  (runner, { stream }) => ({
    dispatchReactionChange(reaction) {
      container.saveReaction?.(reaction);

      runner.mergeStateUpdate(stream.change(reaction));
    },
  });
