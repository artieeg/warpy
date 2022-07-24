import { INotification, IInvite } from '@warpy/lib';
import { NotificationStore, MessageService } from 'lib';

export class NotificationService {
  constructor(
    private notificationStore: NotificationStore,
    private messageService: MessageService,
  ) {}

  private async sendNotification(user: string, notification: INotification) {
    this.messageService.sendMessage(user, {
      event: 'notification',
      data: {
        notification,
      },
    });
  }

  async createInviteNotification(invite: IInvite) {
    //If the stream hasn't been started yet, dont send the notification
    if (!invite.stream) {
      return;
    }

    const notification = await this.notificationStore.createInviteNotification(
      invite,
    );

    this.sendNotification(invite.invitee.id, notification);
  }

  async readAllNotifications(user_id: string) {
    await this.notificationStore.readAll(user_id);
  }

  async getUnreadNotifications(user: string) {
    return this.notificationStore.getUnread(user);
  }

  async getReadNotifications(user: string, page: number) {
    return this.notificationStore.getAll(user);
  }

  async cancelNotification(notification_id: string) {
    const notification = await this.notificationStore.get(notification_id);

    this.messageService.sendMessage(notification.user_id, {
      event: 'notification-deleted',
      data: {
        notification_id,
      },
    });

    await this.notificationStore.del(notification_id, notification.user_id);
  }
}
