import { runner } from "@app/store";
import { INotification } from "@warpy/lib";
import { StoreSlice } from "../types";
import { NotificationService } from "../app/notification";

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
      runner.mergeStateUpdate(new NotificationService(get()).readAll());
    },

    async dispatchNotificationsFetchUnread() {
      await runner.mergeStateUpdate(
        new NotificationService(get()).fetchUnread()
      );
    },

    async dispatchNotificationsFetchRead() {
      await runner.mergeStateUpdate(new NotificationService(get()).fetchRead());
    },

    dispatchNotificationAdd(notification) {
      runner.mergeStateUpdate(
        new NotificationService(get()).addNewNotification(notification)
      );
    },

    dispatchNotificationRemove(id) {
      runner.mergeStateUpdate(new NotificationService(get()).remove(id));
    },
  });
