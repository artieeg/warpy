import {useStore} from '@app/store';
import shallow from 'zustand/shallow';

export const useStreamSpeakers = () => {
  const speakers = useStore(state => state.speakers, shallow);

  return Object.values(speakers);
};
