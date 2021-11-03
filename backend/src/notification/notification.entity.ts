import { InviteEntity } from '@backend_2/invite/invite.entity';
import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { INotification } from '@warpy/lib';

@Injectable()
export class NotificationEntity {
  constructor(private prisma: PrismaService) {}

  static toNotificationDTO(notification: any): INotification {
    return {
      id: notification.id,
      user_id: notification.user_id,
      invite:
        notification.invite && InviteEntity.toInviteDTO(notification.invite),
      hasBeenSeen: notification.hasBeenSeen,
      created_at: notification.created_at,
    };
  }

  async getById(id: string): Promise<INotification> {
    const data = await this.prisma.notification.findUnique({
      where: { id },
    });

    return NotificationEntity.toNotificationDTO(data);
  }

  async createFromInvite(user_id: string, invite_id: string) {
    const isBot = user_id.slice(0, 3) === 'bot';

    const notification = await this.prisma.notification.create({
      data: {
        user_id: isBot ? null : user_id,
        bot_id: isBot ? user_id : null,
        invite_id,
      },
      include: {
        invite: {
          include: {
            user_invitee: true,
            bot_invitee: true,
            inviter: true,
            stream: true,
          },
        },
      },
    });

    return NotificationEntity.toNotificationDTO(notification);
  }

  async getUnread(user_id: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        user_id,
        hasBeenSeen: false,
      },
      include: {
        invite: {
          include: {
            user_invitee: true,
            bot_invitee: true,
            inviter: true,
            stream: true,
          },
        },
      },
    });

    return notifications.map(NotificationEntity.toNotificationDTO);
  }

  async getAll(user_id: string, page: number) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        user_id,
      },
      include: {
        invite: {
          include: {
            user_invitee: true,
            bot_invitee: true,
            inviter: true,
            stream: true,
          },
        },
      },
      skip: page * 50,
      take: 50,
    });

    return notifications.map(NotificationEntity.toNotificationDTO);
  }

  async readAll(user_id: string) {
    await this.prisma.notification.updateMany({
      where: {
        user_id,
      },
      data: {
        hasBeenSeen: true,
      },
    });
  }

  async delete(id: string) {
    const notification = await this.prisma.notification.delete({
      where: {
        id,
      },
      include: {
        invite: true,
      },
    });

    return NotificationEntity.toNotificationDTO(notification);
  }
}
