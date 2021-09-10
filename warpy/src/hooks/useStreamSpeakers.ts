import {useStreamStore} from '@app/stores';
import shallow from 'zustand/shallow';

export const useStreamSpeakers = () => {
  const speakers = useStreamStore(state => state.speakers, shallow);

  return Object.values(speakers);
};
