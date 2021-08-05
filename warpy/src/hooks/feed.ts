import {useWebSocketContext} from '@app/components';
import {Stream} from '@app/models';
import {useEffect, useState} from 'react';

export const useFeed = () => {
  const [feed, setFeed] = useState<Stream[]>([]);

  const ws = useWebSocketContext();

  useEffect(() => {
    ws.feed.get(0).then((data: any) => {
      console.log('fetched feed', data);
      setFeed(prev => [...prev, ...data.feed]);
    });
  }, [ws]);

  return feed;
};
