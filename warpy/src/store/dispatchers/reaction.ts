import {StoreSlice} from '../types';

export interface IReactionDispatchers {
  dispatchReactionChange: (reaction: string) => void;
}

export const createReactionDispatchers: StoreSlice<IReactionDispatchers> =
  set => ({
    dispatchReactionChange(reaction) {
      set({
        reaction,
      });
    },
  });
