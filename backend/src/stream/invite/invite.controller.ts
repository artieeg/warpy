import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { OnParticipantLeave } from '@warpy-be/interfaces';
import { EVENT_PARTICIPANT_LEAVE } from '@warpy-be/utils';
import {
  IInviteActionRequest,
  ICancelInviteRequest,
  ICancelInviteResponse,
  IInviteRequest,
  IInviteResponse,
  IInviteSuggestionsRequest,
  IInviteSuggestionsResponse,
} from '@warpy/lib';
import { InviteService } from './invite.service';

@Controller()
export class InviteController implements OnParticipantLeave {
  constructor(private inviteService: InviteService) {}

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
