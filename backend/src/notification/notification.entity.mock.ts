import { getMockedInstance } from '@warpy-be/utils';
import { NotificationEntity } from './notification.entity';

export const mockedNotificationEntity =
  getMockedInstance<NotificationEntity>(NotificationEntity);
