import create, {GetState, SetState} from 'zustand';
import {IAPISlice, createAPISlice} from './slices/createAPISlice';
import {IFeedSlice, createFeedSlice} from './slices/createFeedSlice';
import {
  IFollowingSlice,
  createFollowingSlice,
} from './slices/createFollowingSlice';
import {IStreamSlice, createStreamSlice} from './slices/createStreamSlice';
import {IUserSlice, createUserSlice} from './slices/createUserSlice';
import {createMediaSlice, IMediaSlice} from './slices/createMediaSlice';
import {createDeviceSlice, IDeviceSlice} from './slices/createDeviceSlice';
import {createChatSlice, IChatSlice} from './slices/createChatSlice';
import {State, UseStore} from 'zustand';
import {createTokenSlice, ITokenSlice} from './slices/createTokenSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {configurePersist} from 'zustand-persist';
import {createToastSlice, IToastSlice} from './slices/createToastSlice';
import {createModalSlice, IModalSlice} from './slices/createModalSlice';
import {
  createReactionSlice,
  IReactionSlice,
} from './slices/createReactionSlice';

interface Selectors<StoreType> {
  use: {
    [key in keyof StoreType]: () => StoreType[key];
  };
}

function createSelectorHooks<StoreType extends State>(
  store: UseStore<StoreType>,
) {
  (store as any).use = {};

  Object.keys(store.getState()).forEach(key => {
    const selector = (state: StoreType) => state[key as keyof StoreType];
    (store as any).use[key] = () => store(selector);
  });

  return store as UseStore<StoreType> & Selectors<StoreType>;
}

export interface IStore
  extends IStreamSlice,
    IFeedSlice,
    IUserSlice,
    IFollowingSlice,
    IMediaSlice,
    IDeviceSlice,
    IChatSlice,
    IModalSlice,
    ITokenSlice,
    IReactionSlice,
    IToastSlice,
    IAPISlice {
  set: SetState<IStore>;
  get: GetState<IStore>;
}

export const useStore = createSelectorHooks<IStore>(
  create<IStore>((set, get): IStore => {
    return {
      ...createModalSlice(set, get),
      ...createStreamSlice(set, get),
      ...createFeedSlice(set, get),
      ...createAPISlice(set, get),
      ...createUserSlice(set, get),
      ...createFollowingSlice(set, get),
      ...createMediaSlice(set, get),
      ...createDeviceSlice(set, get),
      ...createChatSlice(set, get),
      ...createTokenSlice(set, get),
      ...createToastSlice(set, get),
      ...createReactionSlice(set, get),
      set,
      get,
    };
  }),
);
