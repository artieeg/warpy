import { IInvite } from "@warpy/lib";

export const NotificationService = {
  async createInviteNotification(invite: IInvite) {},

  async sendNewFollowNofification(followedUser: string, follower: string) {
    throw new Error("unimplemented");
  },
};
