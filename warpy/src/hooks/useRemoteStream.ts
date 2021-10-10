import {useStore} from '@app/store';
import {useEffect} from 'react';
import shallow from 'zustand/shallow';
import {useRemoteStreams} from './useRemoteStreams';
import {useKickHandler} from './useKickHandler';

export const useRemoteStream = (id: string) => {
  const {videoStreams} = useRemoteStreams();

  const [join] = useStore(state => [state.join, state.isSpeaker], shallow);

  useEffect(() => {
    if (id) {
      join(id);
    }
  }, [id]);

  useKickHandler();

  return {
    videoStreams,
  };
};
