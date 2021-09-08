import {useParticipantStore} from '@app/stores';
import shallow from 'zustand/shallow';

export const useStreamSpeakers = () => {
  const participants = useParticipantStore(state => state.speakers, shallow);

  return Object.values(participants);

  /*
  return useMemo(
    () =>
      participants.filter(p => p.role === 'speaker' || p.role === 'streamer'),
    [participants],
  );
  */
};
