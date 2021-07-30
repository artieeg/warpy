import {Participant} from '@app/models/participant';
import {useParticipantsStore} from '@app/stores';
import shallow from 'zustand/shallow';

export const useSpeakingRequests = (): Participant[] => {
  return useParticipantsStore(state => state.raisedHands, shallow);
};
