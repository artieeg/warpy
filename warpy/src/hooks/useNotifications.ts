import {useStore} from '@app/store';
import {useCallback, useEffect} from 'react';

export const useNotifications = () => {
  const notifications = useStore.use.notifications();

  useEffect(() => {
    useStore.getState().readAllNotifications();
  }, [notifications.length]);

  const fetchMoreNotifications = useCallback(() => {
    useStore.getState().fetchReadNotifications();
  }, []);

  useEffect(() => {
    fetchMoreNotifications();
  }, []);

  return {notifications, fetchMoreNotifications};
};
