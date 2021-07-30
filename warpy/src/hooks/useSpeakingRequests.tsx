import {Participant} from '@app/models/participant';
import {useParticipantsStore} from '@app/stores';
import {useMemo} from 'react';
import shallow from 'zustand/shallow';

export const useSpeakingRequests = (): Participant[] => {
  const participants = useParticipantsStore(
    state => state.participants,
    shallow,
  );

  return useMemo(
    () => participants.filter(p => p.isRaisingHand),
    [participants],
  );
};
