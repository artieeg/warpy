import {DURATION} from '@app/types';
import {StoreSlice} from '../types';

export interface IToastDispatchers {
  dispatchToastMessage: (message: string, duration?: DURATION) => void;
}

export const createToastDispatchers: StoreSlice<IToastDispatchers> = set => ({
  dispatchToastMessage(message, duration) {
    set({
      message,
      duration: duration || null,
    });
  },
});
