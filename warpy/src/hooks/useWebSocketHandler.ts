import {APIClient} from '@warpy/api';
import {useEffect} from 'react';

export const useWebSocketHandler = (api: APIClient) => {
  useEffect(() => {
    return () => {
      api.observer.removeAllListeners();
    };
  }, [api]);
};
