import {Stream} from '@app/models';
import create from 'zustand';

interface IFeedStore {
  feed: Stream[];
  addStreams: (streams: Stream[]) => any;
}

export const useFeedStore = create<IFeedStore>(set => ({
  feed: [],
  addStreams: streams => {
    set(state => ({
      feed: [...state.feed, ...streams],
    }));
  },
}));
