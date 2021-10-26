import {Stream} from '@app/models';
import {StoreSlice} from '../types';

export interface IFeedSlice {
  latestFeedPage: number;
  feed: Stream[];
  isFeedLoading: boolean;
}

export const createFeedSlice: StoreSlice<IFeedSlice> = () => ({
  latestFeedPage: 0,
  isFeedLoading: false,
  feed: [],
});
