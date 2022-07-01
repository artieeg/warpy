import {useStore} from '@app/store';
import {useEffect} from 'react';
import shallow from 'zustand/shallow';

export const useFeed = () => {
  const [feed, category, dispatchFeedFetchNext] = useStore(
    state => [
      state.feed,
      state.selectedFeedCategory,
      state.dispatchFeedFetchNext,
    ],
    shallow,
  );

  useEffect(() => {
    //Check if category is selected, then fetch
    if (category) {
      dispatchFeedFetchNext();
    }
  }, [category]);

  return feed;
};
