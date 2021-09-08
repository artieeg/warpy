import {useMemo} from 'react';
import {Participant} from '@app/models';
import {useParticipantStore} from '@app/stores';
import shallow from 'zustand/shallow';

export const useStreamParticipant = (id: string): Participant | undefined => {
  const participants = useParticipantStore(
    state => state.participants,
    shallow,
  );

  return useMemo(() => participants.find(p => p.id === id), [participants, id]);
};
