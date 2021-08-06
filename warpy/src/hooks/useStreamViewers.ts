import {useWebSocketContext} from '@app/components/WebSocketContext';
import {Participant} from '@app/models';
import shallow from 'zustand/shallow';
import {useParticipantsStore} from '@app/stores';
import {useCallback, useMemo} from 'react';

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

  const fetchViewers = useCallback(async () => {
    const {viewers: fetchedViewers} = await ws.stream.getViewers(
      stream!,
      page + 1,
    );

    useParticipantsStore.getState().addViewers(fetchedViewers, page + 1);
  }, [stream]);

  return [viewers, fetchViewers];
};
