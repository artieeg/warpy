import { NotificationDAO } from "@backend/dal";
import { IInvite } from "@warpy/lib";
import { MessageService } from "./message";

export const NotificationService = {
  async createInviteNotification(invite: IInvite) {
    const notification = await NotificationDAO.createFromInvite(
      invite.invitee.id,
      invite.id
    );

    const { invitee } = invite;
    const { id } = invitee;

    MessageService.sendMessage(id, {
      event: "notification",
      data: {
        notification,
      },
    });
  },

  async readAllNotifications(user_id: string) {
    await NotificationDAO.readAll(user_id);
  },

  async cancelNotification(user_id: string, notification_id: string) {
    //const notification = await NotificationDAO.delete(id);

    MessageService.sendMessage(user_id, {
      event: "notification-deleted",
      data: {
        notification_id,
      },
    });
  },

  async sendNewFollowNofification(followedUser: string, follower: string) {
    throw new Error("unimplemented");
  },
};
