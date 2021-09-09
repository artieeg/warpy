import {Participant} from '@app/models/participant';
import {useParticipantStore} from '@app/stores';
import {useMemo} from 'react';
import shallow from 'zustand/shallow';

export const useSpeakingRequests = (): Participant[] => {
  const viewersWithRaisedHands = useParticipantStore(
    state => state.viewersWithRaisedHands,
    shallow,
  );

  return useMemo(
    () => Object.values(viewersWithRaisedHands),
    [viewersWithRaisedHands],
  );
};
