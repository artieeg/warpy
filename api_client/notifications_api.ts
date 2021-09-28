import { INotificationEvent } from "@warpy/lib";
import { APIModule, EventHandler } from "./types";

export interface INotificationAPI {
  onNewNotification: EventHandler<INotificationEvent>;
}

export const NotificationAPI: APIModule<INotificationAPI> = (socket) => ({
  onNewNotification: (handler) => socket.on("notification", handler),
});
