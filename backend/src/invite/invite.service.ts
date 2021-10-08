import { FollowEntity } from '@backend_2/follow/follow.entity';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IInvite, IUser } from '@warpy/lib';
import { InviteEntity } from './invite.entity';

@Injectable()
export class InviteService {
  constructor(
    private inviteEntity: InviteEntity,
    private followEntity: FollowEntity,
    private eventEmitter: EventEmitter2,
  ) {}

  async createStreamInvite({
    inviter,
    stream,
    invitee,
  }: {
    inviter: string;
    stream: string;
    invitee: string;
  }): Promise<IInvite> {
    const invite = await this.inviteEntity.create({
      invitee,
      inviter,
      stream,
    });

    this.eventEmitter.emit('notification.invite.create', invite);

    return invite;
  }

  async deleteInvite(user: string, invite_id: string) {
    const { notification_id, invitee_id } = await this.inviteEntity.delete(
      invite_id,
      user,
    );

    if (notification_id) {
      this.eventEmitter.emit('notification.cancel', notification_id);
    }
  }

  async getInviteSuggestions(user: string, _stream: string): Promise<IUser[]> {
    const [followed, following] = await Promise.all([
      this.followEntity.getFollowed(user),
      this.followEntity.getFollowers(user),
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
      suggestions.map((user) => [user.id, user]),
    );

    return Array.from(uniqueSuggestionMap.values());
  }
}
