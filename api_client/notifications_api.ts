import {
  INotificationDeleteEvent,
  INotificationEvent,
  INotificationsPage,
} from "@warpy/lib";
import { APIModule, EventHandler } from "./types";

export interface INotificationAPI {
  onNewNotification: EventHandler<INotificationEvent>;
  onNotificationDelete: EventHandler<INotificationDeleteEvent>;
  readAll: () => void;

  getUnread: () => Promise<INotificationsPage>;
  getRead: (page: number) => Promise<INotificationsPage>;
}

export const NotificationAPI: APIModule<INotificationAPI> = (socket) => ({
  onNewNotification: (handler) => socket.on("notification", handler),
  onNotificationDelete: (handler) => socket.on("notification-deleted", handler),
  readAll: () => socket.publish("read-notifications", {}),

  getRead: (page) => socket.request("get-read-notifications", { page }),
  getUnread: () => socket.request("get-unread-notifications", {}),
});
