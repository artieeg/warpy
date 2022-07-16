import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  OnNewStream,
  OnParticipantLeave,
  OnUserConnect,
  OnUserDisconnect,
} from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_LEAVE,
  EVENT_STREAM_CREATED,
  EVENT_USER_CONNECTED,
  EVENT_USER_DISCONNECTED,
} from '@warpy-be/utils';
import {
  IInviteActionRequest,
  ICancelInviteRequest,
  ICancelInviteResponse,
  IInviteRequest,
  IInviteResponse,
  IInviteSuggestionsRequest,
  IInviteSuggestionsResponse,
} from '@warpy/lib';
import { NjsInviteService } from './invite.service';
import { NjsInviteStore } from './invite.store';

@Controller()
export class InviteController
  implements OnParticipantLeave, OnUserConnect, OnUserDisconnect, OnNewStream
{
  constructor(
    private inviteService: NjsInviteService,
    private inviteStore: NjsInviteStore,
  ) {}

  @OnEvent(EVENT_STREAM_CREATED)
  async onNewStream({ stream: { owner, id } }) {
    await this.inviteService.notifyAboutStreamId(id, owner);
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    return this.inviteStore.setUserOnlineStatus(user, false);
  }

  /** Send new invites if there are any */
  @OnEvent(EVENT_USER_CONNECTED)
  async onUserConnect({ user }) {
    await Promise.all([
      this.inviteStore.setUserOnlineStatus(user, true),
      this.inviteService.checkNewInvitesFor(user),
    ]);
  }

  /** Clear user invites */
  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user }) {
    await this.inviteService.deleteUserInvites(user);
  }

  @MessagePattern('user.invite')
  async onNewInvite({
    user,
    stream,
    invitee,
  }: IInviteRequest): Promise<IInviteResponse> {
    const invite = await this.inviteService.createStreamInvite({
      inviter: user,
      invitee,
      stream,
    });

    console.log('created invite', { invite });

    return { invite };
  }

  @MessagePattern('user.invite-suggestions')
  async onInviteSuggestions({
    stream,
    user,
  }: IInviteSuggestionsRequest): Promise<IInviteSuggestionsResponse> {
    const suggestions = await this.inviteService.getInviteSuggestions(
      user,
      stream,
    );

    return {
      suggestions,
    };
  }

  @MessagePattern('invite.action')
  async onInviteAccept({ invite, action }: IInviteActionRequest) {
    if (action === 'accept') {
      await this.inviteService.acceptInvite(invite);
    } else {
      await this.inviteService.declineInvite(invite);
    }
  }

  @MessagePattern('user.cancel-invite')
  async onInviteCancel(
    data: ICancelInviteRequest,
  ): Promise<ICancelInviteResponse> {
    await this.inviteService.deleteInvite(data.invite_id);

    return {
      status: 'ok',
    };
  }
}
