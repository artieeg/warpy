import {StoreSlice} from '../types';

type DURATION = 'LONG' | 'SHORT';

export interface IToastSlice {
  message: string | null;
  duration: DURATION | null;
  showToastMessage: (message: string, duration?: DURATION) => void;
}

export const createToastSlice: StoreSlice<IToastSlice> = set => ({
  message: null,
  duration: null,
  showToastMessage(message, duration) {
    set({
      message,
      duration: duration || null,
    });
  },
});
