import {useDispatcher, useStoreShallow} from '@app/store';
import {useState, useEffect} from 'react';
import {useDebounce} from 'use-debounce';

export const useUserSearch = () => {
  const [search, setSearch] = useState('');
  const [query] = useDebounce(search, 300);

  const dispatch = useDispatcher();
  const [userSearchResult, isLoading] = useStoreShallow(store => [
    store.userSearchResult,
    store.isSearchingUsers,
  ]);

  useEffect(() => {
    if (query.length === 0) {
      dispatch(({user}) => user.resetUserSearch());
    } else {
      dispatch(({user}) => user.searchUsers(query));
    }
  }, [query]);

  return {setSearch, users: userSearchResult, isLoading};
};
