import {Participant} from '@app/models';
import shallow from 'zustand/shallow';
import {useStreamStore} from '@app/stores';
import {useMemo} from 'react';

export const useStreamViewers = (): [Participant[], () => any] => {
  const [viewers, fetchMoreViewers] = useStreamStore(
    state => [state.viewers, state.fetchMoreViewers],
    shallow,
  );

  const viewersArray = useMemo(() => Object.values(viewers), [viewers]);

  return [viewersArray, fetchMoreViewers];
};
