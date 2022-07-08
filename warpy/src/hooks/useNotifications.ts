import {useDispatcher, useStoreShallow} from '@app/store';
import {useCallback, useEffect} from 'react';

export const useNotifications = () => {
  const dispatch = useDispatcher();
  const [notifications] = useStoreShallow(store => [store.notifications]);

  useEffect(() => {
    dispatch(({notification}) => notification.readAll());
  }, [notifications.length]);

  const fetchMoreNotifications = useCallback(() => {
    dispatch(({notification}) => notification.fetchRead());
  }, []);

  useEffect(() => {
    fetchMoreNotifications();
  }, []);

  return {notifications, fetchMoreNotifications};
};
