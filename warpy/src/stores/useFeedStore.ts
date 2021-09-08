import {Stream} from '@app/models';
import create from 'zustand';
import {useAPIStore} from './useAPIStore';

interface IFeedStore {
  page: number;
  feed: Stream[];
  fetchNextPage: () => void;
  loading: boolean;
}

export const useFeedStore = create<IFeedStore>((set, get) => ({
  page: 0,
  loading: false,
  feed: [],
  fetchNextPage: async () => {
    set({loading: true});
    const {feed} = await useAPIStore.getState().api.feed.get(get().page);

    set(state => ({
      feed: [...state.feed, ...feed.map(Stream.fromJSON)],
    }));
  },
}));
