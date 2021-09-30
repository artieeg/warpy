import { INotification } from "@warpy/lib";
import { prisma, runPrismaQuery } from "./client";
import { toInviteDTO } from "./invite";

export const toNotificationDTO = (notification: any): INotification => {
  return {
    id: notification.id,
    invite: notification.invite && toInviteDTO(notification.invite),
    hasBeenSeen: notification.hasBeenSeen,
    created_at: notification.created_at,
  };
};

export const NotificationDAO = {
  async createFromInvite(user_id: string, invite_id: string) {
    const notification = await runPrismaQuery(() =>
      prisma.notification.create({
        data: {
          user_id,
          invite_id,
        },
        include: {
          invite: {
            include: {
              invitee: true,
              inviter: true,
              stream: true,
            },
          },
        },
      })
    );

    return toNotificationDTO(notification);
  },

  async getUnread(user_id: string) {
    const notifications = await runPrismaQuery(() =>
      prisma.notification.findMany({
        where: {
          user_id,
          hasBeenSeen: false,
        },
        include: {
          invite: {
            include: {
              invitee: true,
              inviter: true,
              stream: true,
            },
          },
        },
      })
    );

    return notifications.map(toNotificationDTO);
  },

  async getAll(user_id: string, page: number) {
    const notifications = await runPrismaQuery(() =>
      prisma.notification.findMany({
        where: {
          user_id,
        },
        include: {
          invite: {
            include: {
              invitee: true,
              inviter: true,
              stream: true,
            },
          },
        },
        skip: page * 50,
        take: 50,
      })
    );

    return notifications.map(toNotificationDTO);
  },

  async readAll(user_id: string) {
    await runPrismaQuery(() =>
      prisma.notification.updateMany({
        where: {
          user_id,
        },
        data: {
          hasBeenSeen: true,
        },
      })
    );
  },

  async delete(id: string) {
    const notification = await runPrismaQuery(() =>
      prisma.notification.delete({
        where: {
          id,
        },
        include: {
          invite: true,
        },
      })
    );

    return toNotificationDTO(notification);
  },
};
