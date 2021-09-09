import {Participant} from '@app/models';
import shallow from 'zustand/shallow';
import {useParticipantStore} from '@app/stores';
import {useMemo} from 'react';

export const useStreamViewers = (): [Participant[], () => any] => {
  const [viewers, fetchMoreViewers] = useParticipantStore(
    state => [state.viewers, state.fetchMoreViewers],
    shallow,
  );

  const viewersArray = useMemo(() => Object.values(viewers), [viewers]);

  return [viewersArray, fetchMoreViewers];
};
