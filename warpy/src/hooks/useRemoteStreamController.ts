import {useStore} from '@app/store';
import {useEffect} from 'react';
import {useKickHandler} from './useKickHandler';

export const useRemoteStreamController = (id: string) => {
  const dispatchJoinStream = useStore(state => state.dispatchStreamJoin);

  useEffect(() => {
    if (id) {
      dispatchJoinStream(id);
    }
  }, [id]);

  useKickHandler();
};