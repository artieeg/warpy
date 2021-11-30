import {IUser} from '@warpy/lib';
import {useStore} from '@warpy/store';
import {useState, useEffect, useCallback} from 'react';
import {useDebounce} from 'use-debounce';

export const useUserSearch = () => {
  const [search, setSearch] = useState('');
  const [value] = useDebounce(search, 300);
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);

  const api = useStore.use.api();

  const searchUsers = useCallback(async () => {
    setLoading(true);
    const response = await api.user.search(value);

    setUsers(response.users);
    setLoading(false);
  }, [value]);

  useEffect(() => {
    if (value.length === 0) {
      setUsers([]);
      setLoading(false);
    } else {
      searchUsers();
    }
  }, [value, searchUsers]);

  return {setSearch, users, isLoading};
};
