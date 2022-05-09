import { Controller } from '@nestjs/common';
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

  @MessagePattern(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user, stream }) {
    this.inviteService.deleteUserInvites(user, stream);
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
  async onInviteAccept({ user, invite, action }: IInviteActionRequest) {
    if (action === 'accept') {
      await this.inviteService.acceptInvite(invite, user);
    } else {
      await this.inviteService.declineInvite(invite, user);
    }
  }

  @MessagePattern('user.cancel-invite')
  async onInviteCancel(
    data: ICancelInviteRequest,
  ): Promise<ICancelInviteResponse> {
    await this.inviteService.deleteInvite(data.user, data.invite_id);

    return {
      status: 'ok',
    };
  }
}
