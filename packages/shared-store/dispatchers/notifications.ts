import { INotification } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface INotificaionDispatchers {
  dispatchNotificationAdd: (notification: INotification) => void;
  dispatchNotificationRemove: (id: string) => void;
  dispatchNotificationsFetchUnread: () => Promise<void>;
  dispatchNotificationsFetchRead: () => Promise<void>;
  dispatchNotificationsReadAll: () => void;
}

export const createNotificationDispatchers: StoreSlice<INotificaionDispatchers> =
  (set, get) => ({
    dispatchNotificationsReadAll() {
      const { api, notifications } = get();

      api.notification.readAll();

      set({
        hasUnseenNotifications: false,
        notifications: notifications.map((n) => ({ ...n, hasBeenSeen: true })),
      });
    },

    async dispatchNotificationsFetchUnread() {
      const { api, notifications } = get();

      const { notifications: unreadNotifications } =
        await api.notification.getUnread();

      set({
        notifications: [...unreadNotifications, ...notifications],
        hasUnseenNotifications: unreadNotifications.length > 0,
      });
    },

    async dispatchNotificationsFetchRead() {
      const { api, notifications, notificationPage } = get();

      const { notifications: unreadNotifications } =
        await api.notification.getRead(notificationPage);

      set({
        notifications: [...unreadNotifications, ...notifications],
        notificationPage: notificationPage + 1,
      });
    },

    dispatchNotificationAdd(notification) {
      if (notification.invite) {
        get().dispatchModalOpen("stream-invite", {
          invite: {
            ...notification.invite,
            notification: notification.id,
          },
        });
      }

      set({ notifications: [notification, ...get().notifications] });
    },

    dispatchNotificationRemove(id) {
      if (get().modalInvite?.notification === id) {
        get().dispatchModalClose();
      }

      set({
        notifications: get().notifications.filter((n) => n.id !== id),
      });
    },
  });
