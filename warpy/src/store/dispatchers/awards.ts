import {StoreSlice} from '../types';

export interface IAwardsDispatchers {
  dispatchSendAward: (awardId: string) => Promise<void>;
}

export const createAwardsDispatchers: StoreSlice<IAwardsDispatchers> = (
  set,
  get,
) => ({
  async dispatchSendAward(id) {},
});
