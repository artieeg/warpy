import { BotsEntity } from '@backend_2/bots/bots.entity';
import { NoPermissionError } from '@backend_2/errors';
import { FollowEntity } from '@backend_2/follow/follow.entity';
import { MessageService } from '@backend_2/message/message.service';
import { StreamEntity } from '@backend_2/stream/stream.entity';
import { TokenService } from '@backend_2/token/token.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { IInvite, IStream, IUser } from '@warpy/lib';
import { InviteEntity } from './invite.entity';

@Injectable()
export class InviteService {
  constructor(
    private inviteEntity: InviteEntity,
    private followEntity: FollowEntity,
    private eventEmitter: EventEmitter2,
    private streamEntity: StreamEntity,
    private messageService: MessageService,
    private tokenService: TokenService,
    private botEntity: BotsEntity,
  ) {}

  async declineInvite(invite: string, user: string) {
    await this.inviteEntity.declineInvite(invite, user);
  }

  async acceptInvite(invite: string, user: string) {
    await this.inviteEntity.acceptInvite(invite, user);
  }

  private async inviteRealUser(
    inviter: string,
    invitee: string,
    stream?: string,
  ) {
    const invite = await this.inviteEntity.create({
      invitee,
      inviter,
      stream,
    });

    this.eventEmitter.emit('notification.invite.create', invite);

    return invite;
  }

  private async inviteBotUser(inviter: string, bot: string, streamId: string) {
    const stream = await this.streamEntity.findById(streamId);

    if (stream.owner !== inviter) {
      throw new NoPermissionError();
    }

    const inviteDetailsToken = this.tokenService.createToken(
      {
        stream: streamId,
      },
      { expiresIn: '5m' },
    );

    this.messageService.sendMessage(bot, {
      event: 'bot-invite',
      data: {
        stream: streamId,
        inviteDetailsToken,
      },
    });
  }

  async createStreamInvite({
    inviter,
    stream,
    invitee,
  }: {
    inviter: string;
    stream: string;
    invitee: string;
  }): Promise<IInvite | null> {
    const isBot = invitee.slice(0, 3) === 'bot';

    if (isBot) {
      await this.inviteBotUser(inviter, invitee, stream);

      return null;
    } else {
      const invite = await this.inviteRealUser(inviter, invitee, stream);
      return invite;
    }
  }

  @OnEvent('stream.created')
  async notifyAboutStreamId({ stream: { owner, id } }: { stream: IStream }) {
    const invitedUserIds =
      await this.inviteEntity.findUsersInvitedToDraftedStream(owner);

    invitedUserIds.forEach((user) => {
      this.eventEmitter.emit('invite.stream-id-available', { id, user });
    });
  }

  async deleteInvite(user: string, invite_id: string) {
    const { notification_id } = await this.inviteEntity.delete(invite_id, user);

    if (notification_id) {
      this.eventEmitter.emit('notification.cancel', notification_id);
    }
  }

  async getInviteSuggestions(user: string, _stream: string): Promise<IUser[]> {
    const [followed, following, bots] = await Promise.all([
      this.followEntity.getFollowed(user),
      this.followEntity.getFollowers(user),
      this.botEntity.getMany(),
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

    return [...bots, ...Array.from(uniqueSuggestionMap.values())];
  }
}
