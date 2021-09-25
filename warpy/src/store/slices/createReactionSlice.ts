import {reactionCodes} from '@app/components/Reaction';
import {StoreSlice} from '../types';

export interface IReactionSlice {
  reaction: string;
  setCurrentReaction: (reaction: string) => void;
}

export const createReactionSlice: StoreSlice<IReactionSlice> = set => ({
  reaction: reactionCodes[0],
  setCurrentReaction(reaction) {
    set({
      reaction,
    });
  },
});
