import { container } from "../container";
import { StoreSlice } from "../types";

export interface IReactionDispatchers {
  dispatchReactionChange: (reaction: string) => void;
}

export const createReactionDispatchers: StoreSlice<IReactionDispatchers> = (
  set
) => ({
  dispatchReactionChange(reaction) {
    container.saveReaction?.(reaction);

    set({
      reaction,
    });
  },
});
