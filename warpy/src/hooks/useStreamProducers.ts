import {useStore} from '@app/store';

export const useStreamProducers = () => {
  const streamers = useStore(state => state.streamers);

  return Object.values(streamers);
};
