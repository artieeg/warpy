import { MessageHandler, IReadNotifications } from "@warpy/lib";
import { NotificationService } from "@backend/services";

export const onReadNotifications: MessageHandler<IReadNotifications> = async (
  data
) => {
  const { user } = data;

  await NotificationService.readAllNotifications(user);
};
