import {useCallback, useEffect, useState} from 'react';
import {useWebSocketContext} from '@app/components';

export const useParticipantsCount = () => {
  const [count, setCount] = useState(0);

  const ws = useWebSocketContext();

  const onNewViewer = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const onUserLeave = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  useEffect(() => {
    ws.observer.once('room-info', (data: any) => {
      setCount(data.count);
    });

    ws.observer.on('new-viewer', onNewViewer);
    ws.observer.on('user-left', onUserLeave);

    ws.observer.once('created-room', (data: any) => {
      setCount(data.count);
    });

    return () => {
      ws.observer.off('new-viewer', onNewViewer);
      ws.observer.off('user-left', onUserLeave);
    };
  }, [ws]);

  return count;
};
