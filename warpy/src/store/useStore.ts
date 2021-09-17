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

export interface IStore
  extends IStreamSlice,
    IFeedSlice,
    IUserSlice,
    IFollowingSlice,
    IMediaSlice,
    IDeviceSlice,
    IChatSlice,
    IAPISlice {
  set: SetState<IStore>;
  get: GetState<IStore>;
}

export const useStore = create<IStore>((set, get): IStore => {
  return {
    ...createStreamSlice(set, get),
    ...createFeedSlice(set, get),
    ...createAPISlice(set, get),
    ...createUserSlice(set, get),
    ...createFollowingSlice(set, get),
    ...createMediaSlice(set, get),
    ...createDeviceSlice(set, get),
    ...createChatSlice(set, get),
    set,
    get,
  };
});
