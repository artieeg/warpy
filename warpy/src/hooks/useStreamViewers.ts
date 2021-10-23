import shallow from 'zustand/shallow';
import {useStore} from '@app/store';
import {useMemo} from 'react';
import {IParticipant} from '@warpy/lib';

export const useStreamViewers = (): [IParticipant[], () => any] => {
  const [viewers, dispatchViewersFetch] = useStore(
    state => [state.viewers, state.dispatchViewersFetch],
    shallow,
  );

  const viewersArray = useMemo(() => Object.values(viewers), [viewers]);

  return [viewersArray, dispatchViewersFetch];
};
