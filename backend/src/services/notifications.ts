import { NotificationDAO } from "@backend/dal";
import { IInvite } from "@warpy/lib";
import { MessageService } from "./message";

export const NotificationService = {
  async createInviteNotification(invite: IInvite) {
    const notification = await NotificationDAO.createFromInvite(invite.id);

    const { invitee } = invite;
    const { id } = invitee;

    MessageService.sendMessage(id, {
      event: "notification",
      data: {
        notification,
      },
    });
  },

  async sendNewFollowNofification(followedUser: string, follower: string) {
    throw new Error("unimplemented");
  },
};
