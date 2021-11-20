import {IAward, IAwardModel} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface IAwardsSlice {
  awardModels: IAwardModel[];
  awardDisplayQueue: IAward[];
  awardDisplayCurrent: number;
  //receivedAwards:
}

export const createAwardsSlice: StoreSlice<IAwardsSlice> = () => ({
  awardModels: [],
  awardDisplayQueue: [],
  awardDisplayCurrent: 0,
});
