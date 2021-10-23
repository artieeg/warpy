import {StoreSlice} from '../types';

export interface IFollowingSlice {
  following: string[];
}

export const createFollowingSlice: StoreSlice<IFollowingSlice> =
  (): IFollowingSlice => ({
    following: [],
  });
