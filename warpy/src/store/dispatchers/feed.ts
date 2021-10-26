import {Stream} from '@app/models';
import {StoreSlice} from '../types';

export interface IFeedDispatchers {
  dispatchFeedFetchNext: () => Promise<void>;
}

export const createFeedDispatchers: StoreSlice<IFeedDispatchers> = (
  set,
  get,
) => ({
  async dispatchFeedFetchNext() {
    set({isFeedLoading: true});
    const {feed} = await get().api.feed.get(get().latestFeedPage);

    set(state => ({
      feed: [...state.feed, ...feed.map(Stream.fromJSON)],
    }));
  },
});
