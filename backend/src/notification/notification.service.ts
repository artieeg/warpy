import { MessageService } from '@warpy-be/message/message.service';
import { Injectable } from '@nestjs/common';
import { IInvite, INotification } from '@warpy/lib';
import { NotificationEntity } from './notification.entity';
import cuid from 'cuid';

@Injectable()
export class NotificationService {
  constructor(
    private notificationEntity: NotificationEntity,
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
    /*
    const notification = await this.notificationEntity.createFromInvite(
      invite.invitee.id,
      invite.id,
    );
    */

    const invitee_id = invite.invitee.id;

    this.sendNotification(invitee_id, {
      id: cuid(),
      user_id: invitee_id,
      invite,
      hasBeenSeen: false,
      created_at: Date.now(),
    });
  }

  async readAllNotifications(user_id: string) {
    await this.notificationEntity.readAll(user_id);
  }

  async getUnreadNotifications(user: string) {
    return this.notificationEntity.getUnread(user);
  }

  async getReadNotifications(user: string, page: number) {
    return this.notificationEntity.getAll(user, page);
  }

  async cancelNotification(notification_id: string) {
    const notification = await this.notificationEntity.getById(notification_id);

    this.messageService.sendMessage(notification.user_id, {
      event: 'notification-deleted',
      data: {
        notification_id,
      },
    });
  }
}
