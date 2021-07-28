import {useCallback, useEffect, useState} from 'react';
import {useWebSocketContext} from '@app/components';

export const useParticipantsCount = () => {
  const [count, setCount] = useState(0);

  const ws = useWebSocketContext();

  const onNewViewer = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    ws.once('room-info', (data: any) => {
      setCount(data.count);
    });

    ws.on('new-viewer', onNewViewer);

    ws.once('created-room', (data: any) => {
      setCount(data.count);
    });

    return () => {
      ws.off('new-viewer', onNewViewer);
    };
  }, [ws]);

  return count;
};
