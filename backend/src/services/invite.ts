import { FollowRecordDAL, InviteDAO } from "@backend/dal";
import { IInvite, IUser } from "@warpy/lib";
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

  async deleteInvite(user: string, invite_id: string) {
    const { notification_id, invitee_id } = await InviteDAO.delete(
      invite_id,
      user
    );

    if (notification_id) {
      await NotificationService.cancelNotification(invitee_id, notification_id);
    }
  },

  async getInviteSuggestions(user: string, _stream: string): Promise<IUser[]> {
    const [followed, following] = await Promise.all([
      FollowRecordDAL.getFollowed(user),
      FollowRecordDAL.getFollowers(user),
    ]);

    const suggestions: IUser[] = [
      ...followed.map((f) => f.followed as IUser),
      ...following.map((f) => f.follower as IUser),
    ];

    for (var i = suggestions.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = suggestions[i];
      suggestions[i] = suggestions[j];
      suggestions[j] = temp;
    }

    const uniqueSuggestionMap = new Map<string, IUser>(
      suggestions.map((user) => [user.id, user])
    );

    return Array.from(uniqueSuggestionMap.values());
  },
};
