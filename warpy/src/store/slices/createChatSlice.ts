import {IChatMessage} from '@warpy/lib';
import produce from 'immer';
import {StoreSlice} from '../types';

export interface IChatSlice {
  messages: IChatMessage[];
  sendChatMessage: (message: string) => Promise<void>;
  addMessages: (messages: IChatMessage[]) => void;
  reset: () => void;
}

export const createChatSlice: StoreSlice<IChatSlice> = (set, get) => ({
  messages: [],
  async sendChatMessage(message) {
    const {api} = get();

    const {message: newChatMessage} = await api.stream.sendChatMessage(message);

    set(
      produce<IChatSlice>(state => {
        state.messages = [newChatMessage, ...state.messages];
      }),
    );
  },
  addMessages(messages) {
    set(
      produce<IChatSlice>(state => {
        state.messages = [...messages, ...state.messages];
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
