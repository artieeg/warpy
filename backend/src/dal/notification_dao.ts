import { INotification } from "@warpy/lib";
import { prisma, runPrismaQuery } from "./client";
import { toInviteDTO } from "./invite";

export const toNotificationDTO = (notification: any): INotification => {
  return {
    id: notification.id,
    invite: notification.invite && toInviteDTO(notification.invite),
    hasBeenSeen: notification.hasBeenSeen,
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
