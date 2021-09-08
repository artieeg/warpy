import {Participant} from '@app/models/participant';
import {useParticipantStore} from '@app/stores';
import {useMemo} from 'react';
import shallow from 'zustand/shallow';

export const useSpeakingRequests = (): Participant[] => {
  const participants = useParticipantStore(
    state => state.participants,
    shallow,
  );

  return useMemo(
    () => participants.filter(p => p.isRaisingHand),
    [participants],
  );
};
