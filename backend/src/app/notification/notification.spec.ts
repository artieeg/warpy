import { getMockedInstance } from '@warpy-be/utils';
import {
  createInviteFixture,
  createNotificationFixture,
} from '@warpy-be/__fixtures__';
import { NotificationService, NotificationStore } from '.';
import { MessageService } from '..';

describe('NotificationService', () => {
  const notificationStore =
    getMockedInstance<NotificationStore>(NotificationStore);
  const messageService = getMockedInstance<MessageService>(MessageService);

  const service = new NotificationService(
    notificationStore as any,
    messageService as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetching notifications', () => {
    const unreadNotifications = [
      createNotificationFixture({ hasBeenSeen: false }),
      createNotificationFixture({ hasBeenSeen: false }),
      createNotificationFixture({ hasBeenSeen: false }),
    ];

    const readNotifications = [
      createNotificationFixture({ hasBeenSeen: true }),
      createNotificationFixture({ hasBeenSeen: true }),
      createNotificationFixture({ hasBeenSeen: true }),
    ];

    notificationStore.getUnread.mockResolvedValue(unreadNotifications);
    notificationStore.getAll.mockResolvedValue(readNotifications);

    it('fetches read notifications', async () => {
      expect(service.getReadNotifications('user', 1)).resolves.toStrictEqual(
        readNotifications,
      );
    });

    it('fetches unread notifications', async () => {
      expect(service.getUnreadNotifications('user')).resolves.toStrictEqual(
        unreadNotifications,
      );
    });
  });

  describe('reading notifications', () => {
    const user = 'user0';

    it('reads all notifications', async () => {
      await service.readAllNotifications(user);

      expect(notificationStore.readAll).toBeCalledWith(user);
    });
  });

  describe('creating invite notifications', () => {
    const inviteWithoutStream = createInviteFixture({
      stream: undefined,
      stream_id: undefined,
    });

    const invite = createInviteFixture({});

    it('saves notification', async () => {
      await service.createInviteNotification(invite);

      expect(notificationStore.createInviteNotification).toBeCalledWith(invite);
    });

    it('sends a message to user about new invite', async () => {
      await service.createInviteNotification(invite);

      expect(messageService.sendMessage).toBeCalledWith(
        invite.invitee_id,
        expect.anything(),
      );
    });

    it('doesnt send the notification is the stream hasnt started yet', async () => {
      await service.createInviteNotification(inviteWithoutStream);

      expect(notificationStore.createInviteNotification).not.toBeCalled();
    });
  });
});
