import {useStore} from '@app/store';
import {useEffect} from 'react';

export const useNotifications = () => {
  const notifications = useStore.use.notifications();

  const api = useStore.use.api();

  useEffect(() => {
    api.notification.readAll();
  }, [notifications]);

  return notifications;
};
