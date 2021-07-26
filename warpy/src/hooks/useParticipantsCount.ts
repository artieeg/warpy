import {useEffect, useState} from 'react';
import {useWebSocketContext} from '@app/components';

export const useParticipantsCount = () => {
  const [count, setCount] = useState(0);

  const ws = useWebSocketContext();

  useEffect(() => {
    ws.once('room-info', (data: any) => {
      const {count: participantsCount} = data;

      setCount(participantsCount);
    });
  }, [ws]);

  return count;
};
