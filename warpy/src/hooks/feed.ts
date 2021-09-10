import {useStore} from '@app/store';
import {useEffect} from 'react';
import shallow from 'zustand/shallow';

export const useFeed = () => {
  const [feed, fetchNextPage] = useStore(
    state => [state.feed, state.fetchNextPage],
    shallow,
  );

  useEffect(() => {
    fetchNextPage();
  }, []);

  return feed;
};
