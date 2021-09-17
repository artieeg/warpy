import {IChatMessage} from '@warpy/lib';
import produce from 'immer';
import {StoreSlice} from '../types';

export interface IChatSlice {
  messages: IChatMessage[];
  addMessages: (messages: IChatMessage[]) => void;
  reset: () => void;
}

export const createChatSlice: StoreSlice<IChatSlice> = (set, _get) => ({
  messages: [],
  addMessages(messages) {
    set(
      produce<IChatSlice>(state => {
        state.messages = [...state.messages, ...messages];
      }),
    );
  },
  reset() {
    set(
      produce<IChatSlice>(state => {
        state.messages = [];
      }),
    );
  },
});
