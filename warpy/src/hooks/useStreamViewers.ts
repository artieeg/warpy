import {useWebSocketContext} from '@app/components/WebSocketContext';
import {Participant} from '@app/models';
import shallow from 'zustand/shallow';
import {useParticipantsStore} from '@app/stores';
import {useEffect, useMemo} from 'react';

export const useStreamViewers = (
  stream: string,
): [Participant[], () => any] => {
  const ws = useWebSocketContext();
  const [participants, page] = useParticipantsStore(
    state => [state.participants, state.page],
    shallow,
  );

  const viewers = useMemo(
    () => participants.filter(p => p.role === 'viewer' && !p.isRaisingHand),
    [participants],
  );

  const fetchViewers = () => {
    ws.requestViewers(stream!, page + 1);
  };

  useEffect(() => {
    ws.once('room-info', () => {
      fetchViewers();
    });
  }, [ws]);

  return [viewers, fetchViewers];
};
