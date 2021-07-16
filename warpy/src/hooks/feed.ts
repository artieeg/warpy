import {fetchFeed} from '@app/actions/feed';
import {useAppDispatch, useAppSelector} from '@app/store';
import {useEffect} from 'react';

export const useFeed = () => {
  const feed = useAppSelector(state => state.feed);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  return feed;
};
