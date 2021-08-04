import {useWebSocketContext} from '@app/components';
import {useFeedStore} from '@app/stores';
import {useEffect} from 'react';

export const useFeed = () => {
  const feed = useFeedStore(store => store.feed);

  const ws = useWebSocketContext();

  useEffect(() => {
    ws.getFeed();
  }, [ws]);

  return feed;
};
