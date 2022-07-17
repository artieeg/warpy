import {
  Injectable,
  OnModuleInit,
  Controller,
  Module,
  Global,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  OnStreamEnd,
  OnRoleChange,
  OnParticipantLeave,
  OnParticipantRejoin,
} from '@warpy-be/interfaces';
import {
  EVENT_ROLE_CHANGE,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_PARTICIPANT_LEAVE,
  EVENT_STREAM_ENDED,
  EVENT_PARTICIPANT_KICKED,
  EVENT_USER_DISCONNECTED,
} from '@warpy-be/utils';
import { ParticipantService, ParticipantStore } from 'lib';
import {
  IRequestViewers,
  IRequestViewersResponse,
  IRaiseHand,
  IMediaToggleRequest,
} from '@warpy/lib';
import { MediaModule, NjsMediaService } from './media';
import { BotInstanceModule, NjsBotInstanceStore } from './bot-instance';
import { NjsUserService, UserModule } from './user';

@Injectable()
export class NjsParticipantStore
  extends ParticipantStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService);
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Injectable()
export class NjsParticipantService extends ParticipantService {
  constructor(
    participantStore: NjsParticipantStore,
    botInstanceStore: NjsBotInstanceStore,
    events: EventEmitter2,
    userService: NjsUserService,
    mediaService: NjsMediaService,
  ) {
    super(
      participantStore,
      botInstanceStore,
      events,
      userService,
      mediaService,
    );
  }
}

@Controller()
export class ParticipantController
  implements OnStreamEnd, OnRoleChange, OnParticipantLeave, OnParticipantRejoin
{
  constructor(
    private store: NjsParticipantStore,
    private participant: NjsParticipantService,
  ) {}

  @MessagePattern('viewers.get')
  async onViewersRequest({
    stream,
    page,
  }: IRequestViewers): Promise<IRequestViewersResponse> {
    const viewers = await this.participant.getViewers(stream, page);

    return { viewers };
  }

  @MessagePattern('user.raise-hand')
  async onRaiseHand({ user, flag }: IRaiseHand) {
    await this.participant.setRaiseHand(user, flag);
  }

  @MessagePattern('participant.media-toggle')
  async onMediaToggle({
    user,
    audioEnabled,
    videoEnabled,
  }: IMediaToggleRequest) {
    await this.participant.setMediaEnabled(user, {
      audioEnabled,
      videoEnabled,
    });
  }

  @OnEvent(EVENT_PARTICIPANT_KICKED)
  async onUserKicked({ user }) {
    await this.participant.removeUserFromStream(user);
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    await this.participant.handleLeavingParticipant(user);
  }

  @OnEvent(EVENT_ROLE_CHANGE)
  async onRoleChange({ participant }) {
    return this.store.update(participant.id, participant);
  }

  @OnEvent(EVENT_PARTICIPANT_REJOIN)
  async onParticipantRejoin({ participant: { id, stream } }) {
    return this.store.setDeactivated(id, stream, false);
  }

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user, stream }) {
    await this.participant.removeUserFromStream(user, stream);
    await this.store.setDeactivated(user, stream, true);
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    await this.participant.removeAllParticipantsFrom(stream);
  }
}

@Module({
  imports: [MediaModule, UserModule, BotInstanceModule],
  providers: [NjsParticipantStore, NjsParticipantService],
  controllers: [ParticipantController],
  exports: [NjsParticipantStore, NjsParticipantService],
})
@Global()
export class ParticipantModule {}
