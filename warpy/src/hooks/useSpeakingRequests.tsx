import {useStore} from '@app/store';
import {useMemo} from 'react';
import shallow from 'zustand/shallow';
import {IParticipant} from '@warpy/lib';

export const useSpeakingRequests = (): IParticipant[] => {
  const viewersWithRaisedHands = useStore(
    state => state.viewersWithRaisedHands,
    shallow,
  );

  return useMemo(
    () => Object.values(viewersWithRaisedHands),
    [viewersWithRaisedHands],
  );
};
