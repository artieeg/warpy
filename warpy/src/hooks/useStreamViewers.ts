import {Participant} from '@app/models';
import shallow from 'zustand/shallow';
import {useParticipantStore} from '@app/stores';
import {useMemo} from 'react';

export const useStreamViewers = (): [Participant[], () => any] => {
  const [participants, fetchMoreViewers] = useParticipantStore(
    state => [state.participants, state.fetchMoreViewers],
    shallow,
  );

  const viewers = useMemo(
    () => participants.filter(p => p.role === 'viewer' && !p.isRaisingHand),
    [participants],
  );

  return [viewers, fetchMoreViewers];
};
