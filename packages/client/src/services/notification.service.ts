import { Notification } from "@warpy/lib";
import { Service } from "../Service";

export interface NotificationData {
  notifications: Notification[];
  hasUnseenNotifications: boolean;
  notificationPage: number;
}

export class NotificationService extends Service<NotificationData> {
  getInitialState() {
    return {
      notifications: [],
      notificationPage: 0,
      hasUnseenNotifications: false,
    };
  }

  addNewNotification(notification: Notification) {
    return this.set((state) => {
      state.notifications = [notification, ...state.notifications];
    });
  }

  remove(id: string) {
    return this.set((state) => {
      state.notifications = state.notifications.filter((n) => n.id !== id);
    });
  }

  async fetchUnread() {
    const { api } = this.get();

    const { notifications: unreadNotifications } =
      await api.notification.getUnread();

    return this.set((state) => {
      state.hasUnseenNotifications = unreadNotifications.length > 0;
      state.notifications = [...unreadNotifications, ...state.notifications];
    });
  }

  async fetchRead() {
    const { api, notificationPage } = this.get();

    const { notifications: unreadNotifications } =
      await api.notification.getRead(notificationPage);

    return this.set((state) => {
      state.notifications = [...unreadNotifications, ...state.notifications];
      state.notificationPage = notificationPage + 1;
    });
  }

  readAll() {
    const { api } = this.get();

    api.notification.readAll();

    return this.set((state) => {
      state.hasUnseenNotifications = false;
      state.notifications = state.notifications.map((n) => ({
        ...n,
        hasBeenSeen: true,
      }));
    });
  }
}
