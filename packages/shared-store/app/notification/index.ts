import { INotification } from "@warpy/lib";
import { AppState } from "../AppState";
import { IStore } from "../../useStore";
import { Service } from "../Service";

export class NotificationService extends Service {
  constructor(state: AppState | IStore) {
    super(state);
  }

  addNewNotification(notification: INotification) {
    return this.state.update((state) => {
      state.notifications = [notification, ...state.notifications];
    });
  }

  remove(id: string) {
    return this.state.update((state) => {
      state.notifications = state.notifications.filter((n) => n.id !== id);
    });
  }

  async fetchUnread() {
    const { api } = this.state.get();

    const { notifications: unreadNotifications } =
      await api.notification.getUnread();

    return this.state.update((state) => {
      state.hasUnseenNotifications = unreadNotifications.length > 0;
      state.notifications = [...unreadNotifications, ...state.notifications];
    });
  }

  async fetchRead() {
    const { api, notificationPage } = this.state.get();

    const { notifications: unreadNotifications } =
      await api.notification.getRead(notificationPage);

    return this.state.update((state) => {
      state.notifications = [...unreadNotifications, ...state.notifications];
      state.notificationPage = notificationPage + 1;
    });
  }

  readAll() {
    const { api } = this.state.get();

    api.notification.readAll();

    return this.state.update((state) => {
      state.hasUnseenNotifications = false;
      state.notifications = state.notifications.map((n) => ({
        ...n,
        hasBeenSeen: true,
      }));
    });
  }
}
