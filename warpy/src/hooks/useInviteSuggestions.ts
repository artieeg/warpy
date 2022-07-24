import {useStoreShallow} from '@app/store';
import {User} from '@warpy/lib';
import {useEffect, useState} from 'react';

export const useInviteSuggestions = (): User[] => {
  const [suggestions, setSuggestions] = useState<User[]>([]);

  const [currentStream, api] = useStoreShallow(state => [
    state.stream,
    state.api,
  ]);

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
