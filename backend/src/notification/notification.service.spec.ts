import { NotificationService } from './notification.service';
import {
  createInviteFixture,
  createNotificationFixture,
} from '@warpy-be/__fixtures__';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { NotificationEntity } from './notification.entity';
import { mockedNotificationEntity } from './notification.entity.mock';
import { mockedMessageService } from '@warpy-be/message/message.service.mock';
import { MessageService } from '@warpy-be/message/message.service';

describe('NotificationService', () => {
  let notificationService: NotificationService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(NotificationEntity)
      .useValue(mockedNotificationEntity)
      .overrideProvider(MessageService)
      .useValue(mockedMessageService)
      .compile();

    notificationService = m.get(NotificationService);
  });

  it('creates new invite notification', async () => {
    const invite = createInviteFixture({});
    const notification = createNotificationFixture({ invite });

    mockedNotificationEntity.createFromInvite.mockResolvedValue(notification);

    await notificationService.createInviteNotification(invite);

    expect(mockedMessageService.sendMessage).toBeCalledWith(
      invite.invitee.id,
      expect.anything(),
    );
  });

  it('reads notifications', async () => {
    await notificationService.readAllNotifications('test-user');

    expect(mockedNotificationEntity.readAll).toBeCalledWith('test-user');
  });

  it('returns read notifications', async () => {
    await notificationService.getReadNotifications('test-user', 0);

    expect(mockedNotificationEntity.getAll).toBeCalledWith('test-user', 0);
  });

  it('returns unread notifications', async () => {
    await notificationService.getUnreadNotifications('test-user');

    expect(mockedNotificationEntity.getUnread).toBeCalledWith('test-user');
  });

  it('cancels notification', async () => {
    const notificationToCancel = createNotificationFixture({});
    mockedNotificationEntity.getById.mockResolvedValue(notificationToCancel);

    await notificationService.cancelNotification(notificationToCancel.id);

    expect(mockedMessageService.sendMessage).toBeCalledWith(
      notificationToCancel.user_id,
      expect.anything(),
    );
  });
});
