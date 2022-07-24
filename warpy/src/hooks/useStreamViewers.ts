import shallow from 'zustand/shallow';
import {useDispatcher, useStore} from '@app/store';
import {useCallback, useMemo} from 'react';
import {Participant} from '@warpy/lib';

export const useStreamViewers = (): [Participant[], () => any] => {
  const dispatch = useDispatcher();
  const [viewers] = useStore(state => [state.viewers], shallow);

  const fetchMore = useCallback(() => {
    dispatch(({stream}) => stream.fetchStreamViewers());
  }, [dispatch]);

  const viewersArray = useMemo(() => Object.values(viewers), [viewers]);

  return [viewersArray, fetchMore];
};
