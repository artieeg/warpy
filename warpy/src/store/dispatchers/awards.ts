import {StoreSlice} from '../types';

export interface IAwardsDispatchers {
  dispatchSendAward: (award: string, recipent: string) => Promise<void>;
}

export const createAwardsDispatchers: StoreSlice<IAwardsDispatchers> = (
  _set,
  get,
) => ({
  async dispatchSendAward(award, recipent) {
    const {status} = await get().api.awards.send(award, recipent);

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
