import {useStore} from '@app/store';
import {useMemo} from 'react';
import shallow from 'zustand/shallow';
import {Participant} from '@warpy/lib';

export const useSpeakingRequests = (): Participant[] => {
  const viewersWithRaisedHands = useStore(
    state => state.viewersWithRaisedHands,
    shallow,
  );

  return useMemo(
    () => Object.values(viewersWithRaisedHands),
    [viewersWithRaisedHands],
  );
};
