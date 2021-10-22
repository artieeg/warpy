import {useStore} from '@app/store';
import {useEffect} from 'react';
import {useKickHandler} from './useKickHandler';

export const useRemoteStream = (id: string) => {
  const dispatchJoinStream = useStore(state => state.dispatchJoinStream);

  useEffect(() => {
    if (id) {
      dispatchJoinStream(id);
    }
  }, [id]);

  useKickHandler();
};
