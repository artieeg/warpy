import {StoreSlice} from '../types';

export interface IAwardsDispatchers {
  dispatchSendAward: (
    award: string,
    recipent: string,
    message: string,
  ) => Promise<void>;
}

export const createAwardsDispatchers: StoreSlice<IAwardsDispatchers> = (
  _set,
  get,
) => ({
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
