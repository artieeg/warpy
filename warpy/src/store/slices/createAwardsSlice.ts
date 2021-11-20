import {IAwardModel} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface IAwardsSlice {
  awardModels: IAwardModel[];
  //receivedAwards:
}

export const createAwardsSlice: StoreSlice<IAwardsSlice> = () => ({
  awardModels: [],
});
