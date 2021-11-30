import {useEffect, useState} from 'react';
import {useStore} from '@warpy/store';
import {useDebounce} from 'use-debounce/lib';
import {Keyboard} from 'react-native';

export const useGifs = (search: string) => {
  const [debouncedSearch] = useDebounce(search, 300);

  const [isSearch, setSearch] = useState(false);
  const [next, setNext] = useState<string>();
  const [gifs, setGifs] = useState<string[]>([]);
  const api = useStore.use.api();

  useEffect(() => {
    if (isSearch) {
      setGifs([]);
      setNext(undefined);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedSearch.length === 0) {
      return;
    }

    api.gifs.search(debouncedSearch, next).then(data => {
      setGifs(prev => {
        if (!isSearch) {
          return data.gifs;
        } else {
          return [...prev, ...data.gifs];
        }
      });
      setSearch(true);
      setNext(data.next);
    });
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedSearch.length !== 0) {
      return;
    }

    setGifs([]);
    setNext(undefined);
    setSearch(false);

    api.gifs.getTrending(next).then(data => {
      useStore.setState({
        signUpAvatar: data.gifs[0],
      });

      setGifs(prev => [...prev, ...data.gifs]);
      setNext(data.next);
    });
  }, [debouncedSearch]);

  return gifs;
};
