import {useStore} from '@app/store';
import {useEffect} from 'react';
import shallow from 'zustand/shallow';

export const useFeed = () => {
  const [feed, dispatchFeedFetchNext] = useStore(
    state => [state.feed, state.dispatchFeedFetchNext],
    shallow,
  );

  useEffect(() => {
    dispatchFeedFetchNext();
  }, []);

  return feed;
};
