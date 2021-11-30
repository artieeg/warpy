import {useStore} from '@app/store';
import {useCallback, useEffect} from 'react';

export const useNotifications = () => {
  const notifications = useStore.use.notifications();

  useEffect(() => {
    useStore.getState().dispatchNotificationsReadAll();
  }, [notifications.length]);

  const fetchMoreNotifications = useCallback(() => {
    useStore.getState().dispatchNotificationsFetchRead();
  }, []);

  useEffect(() => {
    fetchMoreNotifications();
  }, []);

  return {notifications, fetchMoreNotifications};
};
