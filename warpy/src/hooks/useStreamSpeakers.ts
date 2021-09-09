import {useParticipantStore} from '@app/stores';
import shallow from 'zustand/shallow';

export const useStreamSpeakers = () => {
  const speakers = useParticipantStore(state => state.speakers, shallow);

  return Object.values(speakers);
};
