import {useEffect, useState} from 'react';
import {useStore} from '@app/store';

export const useGifs = () => {
  const [gifs, setGifs] = useState<string[]>([]);
  const api = useStore.use.api();

  useEffect(() => {
    api.gifs.get(0).then(({gifs}) => {
      useStore.setState({
        signUpAvatar: gifs[0],
      });

      setGifs(gifs);
    });
  }, []);

  return gifs;
};
