import { INotification } from "@warpy/lib";
import { StoreDispatcherSlice } from "../types";

export interface INotificaionDispatchers {
  dispatchNotificationAdd: (notification: INotification) => void;
  dispatchNotificationRemove: (id: string) => void;
  dispatchNotificationsFetchUnread: () => Promise<void>;
  dispatchNotificationsFetchRead: () => Promise<void>;
  dispatchNotificationsReadAll: () => void;
}

export const createNotificationDispatchers: StoreDispatcherSlice<INotificaionDispatchers> =
  (runner, { notification }) => ({
    dispatchNotificationsReadAll() {
      runner.mergeStateUpdate(notification.readAll());
    },

    async dispatchNotificationsFetchUnread() {
      await runner.mergeStateUpdate(notification.fetchUnread());
    },

    async dispatchNotificationsFetchRead() {
      await runner.mergeStateUpdate(notification.fetchRead());
    },

    dispatchNotificationAdd(data) {
      runner.mergeStateUpdate(notification.addNewNotification(data));
    },

    dispatchNotificationRemove(id) {
      runner.mergeStateUpdate(notification.remove(id));
    },
  });
