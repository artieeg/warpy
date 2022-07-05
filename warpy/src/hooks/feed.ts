import {useStore, useStoreShallow} from '@app/store';
import {useCallback, useEffect, useState} from 'react';

export const useFeed = () => {
  //Used to prevent displaying the refresh indicator during the first fetch
  const [initialFeedFetchDone, setInitialFeedFetchDone] = useState(false);

  const [feed, category, isFeedLoading] = useStoreShallow(state => [
    state.feed,
    state.selectedFeedCategory,
    state.isFeedLoading,
  ]);

  useEffect(() => {
    //Check if category is selected, then fetch
    if (category) {
      useStore
        .getState()
        .dispatchFeedFetchNext()
        .then(() => {
          setInitialFeedFetchDone(true);
        });
    }
  }, [category]);

  const refreshFeed = useCallback(() => {
    useStore.getState().dispatchFeedRefetch();
  }, []);

  return {feed, refreshFeed, isFeedLoading, initialFeedFetchDone};
};
