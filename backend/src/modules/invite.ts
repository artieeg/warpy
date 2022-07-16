import { Injectable, OnModuleInit, Controller, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  OnParticipantLeave,
  OnUserConnect,
  OnUserDisconnect,
  OnNewStream,
} from '@warpy-be/interfaces';
import {
  EVENT_STREAM_CREATED,
  EVENT_USER_DISCONNECTED,
  EVENT_USER_CONNECTED,
  EVENT_PARTICIPANT_LEAVE,
} from '@warpy-be/utils';
import { InviteStore, InviteService } from 'lib';
import {
  PrismaModule,
  StreamModule,
  BotsModule,
  TokenModule,
  UserModule,
} from '.';
import {
  IInviteRequest,
  IInviteResponse,
  IInviteSuggestionsRequest,
  IInviteSuggestionsResponse,
  IInviteActionRequest,
  ICancelInviteRequest,
  ICancelInviteResponse,
} from '@warpy/lib';

@Injectable()
export class NjsInviteStore extends InviteStore implements OnModuleInit {
  constructor(configService: ConfigService) {
    super(configService.get('inviteStoreAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Injectable()
export class NjsInviteService extends InviteService {}

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

@Module({
  imports: [PrismaModule, StreamModule, UserModule, TokenModule, BotsModule],
  providers: [NjsInviteStore, NjsInviteService],
  controllers: [InviteController],
  exports: [],
})
export class InviteModule {}
