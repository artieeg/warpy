import {useStore} from '@app/store';
import {useEffect} from 'react';
import shallow from 'zustand/shallow';
import {useRemoteStreams} from './useRemoteStreams';

export const useRemoteStream = (id: string) => {
  const {videoStreams} = useRemoteStreams();

  const [join, totalParticipantCount, isSpeaker] = useStore(
    state => [state.join, state.totalParticipantCount, state.isSpeaker],
    shallow,
  );

  useEffect(() => {
    if (id) {
      join(id);
    }
  }, [id]);

  return {
    totalParticipantCount,
    isSpeaker,
    videoStreams,
  };
};
