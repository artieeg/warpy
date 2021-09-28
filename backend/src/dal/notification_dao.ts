import { INotification } from "@warpy/lib";
import { prisma } from "./client";
import { toInviteDTO } from "./invite";

export const toNotificationDTO = (notification: any): INotification => {
  return {
    id: notification.id,
    invite: notification.invite && toInviteDTO(notification.invite),
  };
};

export const NotificationDAO = {
  async createFromInvite(invite_id: string) {
    const notification = await prisma.notification.create({
      data: {
        invite_id,
      },
      include: {
        invite: {
          include: {
            invitee: true,
            inviter: true,
          },
        },
      },
    });

    return toNotificationDTO(notification);
  },
};
