import {useStore} from '@app/store';
import {useCallback, useEffect, useState} from 'react';
import shallow from 'zustand/shallow';

export const useFeed = () => {
  const [initialFeedFetchDone, setInitialFeedFetchDone] = useState(false);

  const [feed, category, isFeedLoading, dispatchFeedFetchNext] = useStore(
    state => [
      state.feed,
      state.selectedFeedCategory,
      state.isFeedLoading,
      state.dispatchFeedFetchNext,
    ],
    shallow,
  );

  useEffect(() => {
    //Check if category is selected, then fetch
    if (category) {
      dispatchFeedFetchNext().then(() => {
        setInitialFeedFetchDone(true);
      });
    }
  }, [category]);

  const refreshFeed = useCallback(() => {
    dispatchFeedFetchNext();
  }, []);

  return {feed, refreshFeed, isFeedLoading, initialFeedFetchDone};
};
