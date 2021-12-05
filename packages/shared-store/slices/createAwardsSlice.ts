import {IAward, IAwardModel} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface IAwardsSlice {
  /** Maps user ids to their received awards */
  awards: Record<string, IAward[]>;

  awardModels: IAwardModel[];
  awardDisplayQueue: IAward[];
  awardDisplayCurrent: number;
}

export const createAwardsSlice: StoreSlice<IAwardsSlice> = () => ({
  awards: {},
  awardModels: [],
  receivedAwards: [],
  awardDisplayQueue: [],
  awardDisplayCurrent: 0,
});
