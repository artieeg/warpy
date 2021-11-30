import {IChatMessage} from '@warpy/lib';
import produce from 'immer';
import {StoreSlice} from '../types';
import {IStore} from '../useStore';

export interface IChatDispatchers {
  dispatchChatMessages: (messages: IChatMessage[]) => void;
  dispatchChatSendMessage: (message: string) => Promise<void>;
  dispatchChatClearMessages: () => void;
}

export const createChatDispatchers: StoreSlice<IChatDispatchers> = (
  set,
  get,
) => ({
  async dispatchChatSendMessage(message) {
    const {api} = get();
    const {message: newChatMessage} = await api.stream.sendChatMessage(message);

    set(
      produce<IStore>(state => {
        state.messages = [newChatMessage, ...state.messages];
      }),
    );
  },

  dispatchChatClearMessages() {
    set({
      messages: [],
    });
  },

  dispatchChatMessages(messages) {
    set(
      produce<IStore>(state => {
        state.messages = [...messages, ...state.messages];
      }),
    );
  },
});
