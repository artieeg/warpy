import {useDispatcher, useStoreShallow} from '@app/store';
import {useCallback, useEffect, useState} from 'react';

export const useFeed = () => {
  const dispatch = useDispatcher();

  //Used to prevent displaying the refresh indicator during the first fetch
  const [initialFeedFetchDone, setInitialFeedFetchDone] = useState(false);

  const [feed, category, isFeedLoading] = useStoreShallow(state => [
    state.feed,
    state.selectedFeedCategory,
    state.isFeedLoading,
  ]);

  useEffect(() => {
    setInitialFeedFetchDone(false);

    //Check if category is selected, then fetch
    if (category) {
      dispatch(({feed}) => feed.fetchFeedPage()).then(() => {
        setInitialFeedFetchDone(true);
      });
    }
  }, [category]);

  const refreshFeed = useCallback(() => {
    dispatch(({feed}) => feed.fetchFeedPage({refresh: true}));
  }, []);

  return {feed, refreshFeed, isFeedLoading, initialFeedFetchDone};
};
