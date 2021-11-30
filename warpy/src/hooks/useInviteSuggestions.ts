import {useStore} from '@warpy/store';
import {IUser} from '@warpy/lib';
import {useEffect, useState} from 'react';

export const useInviteSuggestions = (): IUser[] => {
  const [suggestions, setSuggestions] = useState<IUser[]>([]);

  const currentStream = useStore.use.stream();
  const api = useStore.use.api();

  useEffect(() => {
    //if (currentStream) {
    setTimeout(() => {
      api.stream
        .getInviteSuggestions('test')
        .then(({suggestions}) => setSuggestions(suggestions));
    }, 1000);
    //}
  }, [currentStream]);

  return suggestions;
};
