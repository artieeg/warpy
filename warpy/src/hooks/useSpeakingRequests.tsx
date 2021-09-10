import {Participant} from '@app/models/participant';
import {useStreamStore} from '@app/stores';
import {useMemo} from 'react';
import shallow from 'zustand/shallow';

export const useSpeakingRequests = (): Participant[] => {
  const viewersWithRaisedHands = useStreamStore(
    state => state.viewersWithRaisedHands,
    shallow,
  );

  return useMemo(
    () => Object.values(viewersWithRaisedHands),
    [viewersWithRaisedHands],
  );
};
