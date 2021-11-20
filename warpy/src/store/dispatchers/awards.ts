import {StoreSlice} from '../types';
import {IAward} from '@warpy/lib';

export interface IAwardsDispatchers {
  dispatchSendAward: (
    award: string,
    recipent: string,
    message: string,
  ) => Promise<void>;

  dispatchAwardDisplayQueueAppend: (award: IAward) => void;
}

export const createAwardsDispatchers: StoreSlice<IAwardsDispatchers> = (
  set,
  get,
) => ({
  dispatchAwardDisplayQueueAppend(award) {
    set({
      awardDisplayQueue: [...get().awardDisplayQueue, award],
    });
  },

  async dispatchSendAward(award, recipent, message) {
    const {status} = await get().api.awards.send(award, recipent, message);

    if (status === 'error') {
      return; ///error handling
    }

    get().dispatchToastMessage(
      'Your award has been just sent, it will arrive shortly',
      'LONG',
    );

    get().dispatchModalClose();
  },
});
