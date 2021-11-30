import {useStore} from '@app/store';
import {useEffect} from 'react';
import shallow from 'zustand/shallow';
import {useKickHandler} from './useKickHandler';

export const useRemoteStreamController = (id: string) => {
  const [dispatchJoinStream, dispatchMediaRequest] = useStore(
    state => [state.dispatchStreamJoin, state.dispatchMediaRequest],
    shallow,
  );

  useEffect(() => {
    if (id) {
      dispatchJoinStream(id);
    }
  }, [id]);

  useKickHandler();
};
