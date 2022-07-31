import {
  EventNewNotification,
  EventNotificationDeleted,
  NotificationsPage,
} from "@warpy/lib";
import { APIModule, EventHandler } from "./types";

export interface INotificationAPI {
  onNewNotification: EventHandler<EventNewNotification>;
  onNotificationDelete: EventHandler<EventNotificationDeleted>;
  readAll: () => void;

  getUnread: () => Promise<NotificationsPage>;
  getRead: (page: number) => Promise<NotificationsPage>;
}

export const NotificationAPI: APIModule<INotificationAPI> = (socket) => ({
  onNewNotification: (handler) => socket.on("notification", handler),
  onNotificationDelete: (handler) => socket.on("notification-deleted", handler),
  readAll: () => socket.publish("read-notifications", {}),

  getRead: (page) => socket.request("get-read-notifications", { page }),
  getUnread: () => socket.request("get-unread-notifications", {}),
});
