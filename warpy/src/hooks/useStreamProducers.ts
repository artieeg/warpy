import {useStore} from '@app/store';

export const useStreamProducers = () => {
  const speakers = useStore(state => state.producers);

  return Object.values(speakers);
};
