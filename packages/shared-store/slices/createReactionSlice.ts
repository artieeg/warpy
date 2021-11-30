import {reactionCodes} from '@app/components/Reaction';
import {StoreSlice} from '../types';

export interface IReactionSlice {
  reaction: string;
}

export const createReactionSlice: StoreSlice<IReactionSlice> = () => ({
  reaction: reactionCodes[0],
});
