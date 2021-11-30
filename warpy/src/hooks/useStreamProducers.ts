import {useStore} from '@warpy/store';

export const useStreamProducers = () => {
  const streamers = useStore(state => state.streamers);

  return Object.values(streamers);
};
