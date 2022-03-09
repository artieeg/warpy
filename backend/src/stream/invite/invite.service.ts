import { BotsEntity } from '@backend_2/bots/bots.entity';
import { NoPermissionError } from '@backend_2/errors';
import { MessageService } from '@backend_2/message/message.service';
import { StreamEntity } from '../common/stream.entity';
import { TokenService } from '@backend_2/token/token.service';
import { FollowEntity } from '@backend_2/user/follow/follow.entity';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { IInvite, InviteStates, IStream, IUser } from '@warpy/lib';
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

  /**
   * Sends invite updates to the user-inviter;
   * Notifies when invited user has accepted or declined the invite
   * */
  private sendInviteState(id: string, inviter: string, state: InviteStates) {
    this.messageService.sendMessage(inviter, {
      event: 'invite-state-update',
      data: {
        id,
        state,
      },
    });
  }

  /**
   * Declines the invite and notifies the inviter
   * */
  async declineInvite(invite: string, user: string) {
    const { id, inviter_id } = await this.inviteEntity.declineInvite(
      invite,
      user,
    );

    this.sendInviteState(id, inviter_id, 'declined');
  }

  /**
   * Accepts the invite and notifies the inviter
   * */
  async acceptInvite(invite: string, user: string) {
    const { id, inviter_id } = await this.inviteEntity.acceptInvite(
      invite,
      user,
    );

    this.sendInviteState(id, inviter_id, 'accepted');
  }

  /**
   * Handles inviting real user
   * Creates invite record and sends a notification
   * */
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

  /**
   * Handles inviting bots
   * Creates permission token to join the stream and sends it to a bot
   * */
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

  /**
   * Listens to new streams
   * When new stream is created, checks if new stream's owner has invited others
   * Then it broadcasts stream's id to invited users
   * */
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

  /**
   * Creates invite suggestions from bots, followers, following
   * */
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