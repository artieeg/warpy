import {useParticipantsStore} from '@app/stores';
import shallow from 'zustand/shallow';

export const useStreamSpeakers = (_stream: string) => {
  return useParticipantsStore(state => state.speakers, shallow);
};
