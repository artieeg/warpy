import {INotification} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface INotificationSlice {
  notifications: INotification[];
  addNotification: (notification: INotification) => void;
  hasUnseenNotifications: boolean;
  notificationPage: number;
  removeNotification: (id: string) => void;
  fetchUnreadNotifications: () => Promise<void>;
  fetchReadNotifications: () => Promise<void>;
  readAllNotifications: () => void;
}

export const createNotificationSlice: StoreSlice<INotificationSlice> = (
  set,
  get,
) => ({
  notifications: [],
  notificationPage: 0,
  hasUnseenNotifications: false,
  readAllNotifications() {
    const {api, notifications} = get();

    api.notification.readAll();

    set({
      hasUnseenNotifications: false,
      notifications: notifications.map(n => ({...n, hasBeenSeen: true})),
    });
  },
  async fetchUnreadNotifications() {
    const {api, notifications} = get();

    const {notifications: unreadNotifications} =
      await api.notification.getUnread();

    set({
      notifications: [...unreadNotifications, ...notifications],
      hasUnseenNotifications: unreadNotifications.length > 0,
    });
  },
  async fetchReadNotifications() {
    const {api, notifications, notificationPage} = get();

    const {notifications: unreadNotifications} = await api.notification.getRead(
      notificationPage,
    );

    set({
      notifications: [...unreadNotifications, ...notifications],
      notificationPage: notificationPage + 1,
    });
  },
  addNotification(notification) {
    set({notifications: [notification, ...get().notifications]});
  },
  removeNotification(id) {
    set({
      notifications: get().notifications.filter(n => n.id !== id),
    });
  },
});
