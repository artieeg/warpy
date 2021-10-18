import {useStore} from '@app/store';
import {useEffect} from 'react';
import shallow from 'zustand/shallow';
import {useKickHandler} from './useKickHandler';

export const useRemoteStream = (id: string) => {
  const [join] = useStore(state => [state.join, state.isSpeaker], shallow);

  useEffect(() => {
    if (id) {
      join(id);
    }
  }, [id]);

  useKickHandler();
};
