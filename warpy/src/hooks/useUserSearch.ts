import {useStore, useStoreShallow} from '@app/store';
import {useState, useEffect} from 'react';
import {useDebounce} from 'use-debounce';

export const useUserSearch = () => {
  const [search, setSearch] = useState('');
  const [value] = useDebounce(search, 300);

  const [userSearchResult, isLoading] = useStoreShallow(store => [
    store.userSearchResult,
    store.isSearchingUsers,
  ]);

  useEffect(() => {
    if (value.length === 0) {
      useStore.getState().dispatchUserSearchReset();
    } else {
      useStore.getState().dispatchUserSearch(value);
    }
  }, [value]);

  return {setSearch, users: userSearchResult, isLoading};
};
