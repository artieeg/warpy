import { NotificationService } from "@backend/services";
import {
  MessageHandler,
  IGetUnreadNotifications,
  INotificationsPage,
  IGetReadNotifications,
} from "@warpy/lib";

const getUnreadNotifications: MessageHandler<
  IGetUnreadNotifications,
  INotificationsPage
> = async (data, respond) => {
  const { user } = data;

  const notifications = await NotificationService.getUnreadNotifications(user);

  respond({
    notifications,
  });
};

const getReadNotifications: MessageHandler<
  IGetReadNotifications,
  INotificationsPage
> = async (data, respond) => {
  const { user, page } = data;

  const notifications = await NotificationService.getReadNotifications(
    user,
    page
  );

  respond({
    notifications,
  });
};

export const NotificationController = {
  getUnreadNotifications,
  getReadNotifications,
};
