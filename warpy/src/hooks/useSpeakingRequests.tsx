import {Participant} from '@app/models/participant';
import {useStore} from '@app/store';
import {useMemo} from 'react';
import shallow from 'zustand/shallow';

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
