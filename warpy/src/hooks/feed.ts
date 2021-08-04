import {useWebSocketContext} from '@app/components';
import {Stream} from '@app/models';
import {useEffect, useState} from 'react';

export const useFeed = () => {
  const [feed, setFeed] = useState<Stream[]>([]);

  const ws = useWebSocketContext();

  console.log(feed);
  useEffect(() => {
    ws.feed.get().then((data: any) => {
      setFeed(prev => [...prev, ...data.feed]);
    });
  }, [ws]);

  return feed;
};
