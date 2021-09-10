import create, {GetState, SetState} from 'zustand';
import {createStreamSlice, IStreamSlice} from './createStreamSlice';
import {createFeedSlice, IFeedSlice} from './createFeedSlice';
import {createAPISlice, IAPISlice} from './createAPISlice';
import {createUserSlice, IUserSlice} from './useUserStore';
import {createFollowingSlice, IFollowingSlice} from './useFollowingStore';

export interface IStore
  extends IStreamSlice,
    IFeedSlice,
    IUserSlice,
    IFollowingSlice,
    IAPISlice {
  set: SetState<IStore>;
  get: GetState<IStore>;
}

export const useStore = create<IStore>((set, get) => ({
  ...createStreamSlice(set, get),
  ...createFeedSlice(set, get),
  ...createAPISlice(set, get),
  ...createUserSlice(set, get),
  ...createFollowingSlice(set, get),
  set,
  get,
}));
