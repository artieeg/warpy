import { InviteDAO } from "@backend/dal";
import { IInvite } from "@warpy/lib";
import { NotificationService } from "./notifications";

export const InviteService = {
  async createStreamInvite({
    inviter,
    stream,
    invitee,
  }: {
    inviter: string;
    stream: string;
    invitee: string;
  }): Promise<IInvite> {
    const invite = await InviteDAO.create({
      invitee,
      inviter,
      stream,
    });

    await NotificationService.createInviteNotification(invite);

    return invite;
  },
};
