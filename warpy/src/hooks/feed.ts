import {useFeedStore} from '@app/stores';
import {useEffect} from 'react';
import shallow from 'zustand/shallow';

export const useFeed = () => {
  const [feed, fetchNextPage] = useFeedStore(
    state => [state.feed, state.fetchNextPage],
    shallow,
  );

  useEffect(() => {
    fetchNextPage();
  }, []);

  return feed;
};
