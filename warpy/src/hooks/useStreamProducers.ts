import {useStore} from '@app/store';
import shallow from 'zustand/shallow';

export const useStreamProducers = () => {
  const speakers = useStore(state => state.producers, shallow);

  return Object.values(speakers);
};
