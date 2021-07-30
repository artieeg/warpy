import {useWebSocketContext} from '@app/components/WebSocketContext';
import {Participant} from '@app/models';
import shallow from 'zustand/shallow';
import {useParticipantsStore} from '@app/stores';

export const useStreamViewers = (
  stream: string,
): [Participant[], () => any] => {
  const ws = useWebSocketContext();
  const [viewers, page] = useParticipantsStore(
    state => [state.viewers, state.page],
    shallow,
  );

  const fetchViewers = () => {
    ws.requestViewers(stream!, page + 1);
  };

  return [viewers, fetchViewers];
};
