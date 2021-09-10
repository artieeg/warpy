import {Stream} from '@app/models';
import {GetState, SetState} from 'zustand';
import {IStore} from './useStore';

export interface IFeedSlice {
  latestFeedPage: number;
  feed: Stream[];
  fetchNextPage: () => void;
  loading: boolean;
}

export const createFeedSlice = (
  set: SetState<IStore>,
  get: GetState<IStore>,
) => ({
  page: 0,
  loading: false,
  feed: [],
  fetchNextPage: async () => {
    set({loading: true});
    const {feed} = await get().api.feed.get(get().latestFeedPage);

    set(state => ({
      feed: [...state.feed, ...feed.map(Stream.fromJSON)],
    }));
  },
});
