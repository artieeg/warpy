import {useDispatcher, useStoreShallow} from '@app/store';
import {useCallback, useEffect, useRef} from 'react';

export const useFeed = () => {
  const dispatch = useDispatcher();

  const [feed, initialFeedFetchDone, category, isFeedLoading] = useStoreShallow(
    state => [
      state.feed,
      state.initialFeedFetchDone,
      state.selectedFeedCategory,
      state.isFeedLoading,
    ],
  );

  const mounted = useRef(false);

  useEffect(() => {
    //Don't fetch feed initially because
    //we've already fetched it on the splash screen in the useAppSetUp hook
    if (!mounted.current) {
      mounted.current = true;

      return;
    }

    //Check if category is selected, then fetch
    if (category) {
      dispatch(({feed}) => feed.fetchFeedPage({initial: true}));
    }
  }, [category]);

  const refreshFeed = useCallback(() => {
    dispatch(({feed}) => feed.fetchFeedPage({refresh: true}));
  }, []);

  return {feed, refreshFeed, isFeedLoading, initialFeedFetchDone};
};
