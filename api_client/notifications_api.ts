import { INotificationDeleteEvent, INotificationEvent } from "@warpy/lib";
import { APIModule, EventHandler } from "./types";

export interface INotificationAPI {
  onNewNotification: EventHandler<INotificationEvent>;
  onNotificationDelete: EventHandler<INotificationDeleteEvent>;
}

export const NotificationAPI: APIModule<INotificationAPI> = (socket) => ({
  onNewNotification: (handler) => socket.on("notification", handler),
  onNotificationDelete: (handler) => socket.on("notification-deleted", handler),
});
