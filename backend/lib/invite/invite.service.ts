import { NoPermissionError } from '@warpy-be/errors';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IInvite, InviteStates, IReceivedInviteEvent, IUser } from '@warpy/lib';
import { EVENT_INVITE_AVAILABLE } from '@warpy-be/utils';
import {
  IUserStore,
  IStreamStore,
  IMessageService,
  ITokenService,
  BotStore,
} from 'lib';
import { IFollowStore } from 'lib/follow/follow.store';
import { IInviteStore } from './invite.store';

export interface IInviteService {
  declineInvite(invite: string): Promise<void>;
  checkNewInvitesFor(user: string): Promise<void>;
  deleteUserInvites(user: string): Promise<void>;
  acceptInvite(invite_id: string): Promise<void>;
  createStreamInvite({
    inviter,
    stream,
    invitee,
  }: {
    inviter: string;
    stream: string;
    invitee: string;
  }): Promise<IInvite | null>;
  notifyAboutStreamId(id: string, owner: string): Promise<void>;
  deleteInvite(invite_id: string): Promise<void>;
  getInviteSuggestions(user: string, _stream: string): Promise<IUser[]>;
}

export class InviteService {
  constructor(
    private inviteStore: IInviteStore,
    private userEntity: IUserStore,
    private followEntity: IFollowStore,
    private eventEmitter: EventEmitter2,
    private streamEntity: IStreamStore,
    private messageService: IMessageService,
    private tokenService: ITokenService,
    private botEntity: BotStore,
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
  async declineInvite(invite: string) {
    const { id, inviter_id } = await this.inviteStore.del(invite);

    this.sendInviteState(id, inviter_id, 'declined');
  }

  async checkNewInvitesFor(user: string) {
    const invites = await this.inviteStore.getPendingInvitesFor(user);

    if (invites.length === 0) {
      return;
    }

    //Emit notifications about each new invite to streams that have already started
    invites
      .filter((invite) => invite.stream_id)
      .forEach((invite) =>
        this.eventEmitter.emit(EVENT_INVITE_AVAILABLE, invite),
      );

    const latestInvite = invites[invites.length - 1];

    console.log({ latestInvite });

    //send the latest invite
    if (latestInvite) {
      this.messageService.sendMessage(user, {
        event: 'new-invite',
        data: {
          invite: latestInvite,
        },
      });
    }

    //Mark invites as received
    this.inviteStore.updateMany(
      invites.map((invite) => invite.id),
      { received: true },
    );
  }

  async deleteUserInvites(user: string) {
    const ids = await this.inviteStore.getUserInviteIds(user);
    await Promise.all(ids.map((id) => this.inviteStore.del(id)));
  }

  /**
   * Accepts the invite and notifies the inviter
   * */
  async acceptInvite(invite_id: string) {
    const { id, inviter_id, stream_id } = await this.inviteStore.get(invite_id);

    //if stream has already started, delete the notification
    if (stream_id) {
      await this.inviteStore.del(invite_id);
    }

    this.sendInviteState(id, inviter_id, 'accepted');
  }

  /**
   * Handles inviting real user
   * Creates invite record and sends a notification
   * */
  private async inviteRealUser(
    inviter_id: string,
    invitee_id: string,
    stream_id?: string,
  ) {
    console.log('1');

    const [inviter, invitee, stream] = await Promise.all([
      this.userEntity.find(inviter_id),
      this.userEntity.find(invitee_id),
      stream_id && this.streamEntity.findById(stream_id),
    ]);
    console.log('2');

    //If the receiver is online, mark the invitation as received
    //else, invitation will be marked as not received and
    //will be sent out once the user has opened the app
    const isInviteeOnline = await this.inviteStore.isUserOnline(invitee.id);

    console.log('3');

    const invite = await this.inviteStore.create({
      invitee,
      inviter,
      stream,
      received: isInviteeOnline,
    });

    console.log('4');

    this.eventEmitter.emit(EVENT_INVITE_AVAILABLE, invite);
    this.messageService.sendMessage(invitee.id, {
      event: 'new-invite',
      data: {
        invite,
      } as IReceivedInviteEvent,
    });
    console.log('5');

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
  async notifyAboutStreamId(id: string, owner: string) {
    const [stream, ownedInviteIds] = await Promise.all([
      this.streamEntity.findById(id),
      this.inviteStore.getUserInviteIds(owner),
    ]);

    const [invitedUserIds] = await Promise.all([
      this.inviteStore.getInvitedUsers(ownedInviteIds),
      this.inviteStore.setStreamData(ownedInviteIds, stream),
    ]);

    invitedUserIds.forEach((user) => {
      this.messageService.sendMessage(user, {
        event: 'stream-id-available',
        data: {
          id,
        },
      });
    });
  }

  async deleteInvite(invite_id: string) {
    await this.inviteStore.del(invite_id);
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
