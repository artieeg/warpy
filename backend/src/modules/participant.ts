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
import { OnStreamEnd, OnRoleChange } from '@warpy-be/interfaces';
import {
  EVENT_ROLE_CHANGE,
  EVENT_STREAM_ENDED,
  EVENT_USER_DISCONNECTED,
} from '@warpy-be/utils';
import { ParticipantService, ParticipantStore } from '@warpy-be/app';
import {
  RequestViewers,
  RequestViewersResponse,
  RequestRaiseHand,
  RequestMediaToggle,
  RequestKickUser,
} from '@warpy/lib';
import { MediaModule, NjsMediaService } from './media';
import { BotInstanceModule, NjsBotInstanceStore } from './bot-instance';
import { NjsUserService, UserModule } from './user';
import { StreamBanStore } from '@warpy-be/app/participant/stream-bans.store';
import { PrismaModule, PrismaService } from './prisma';

@Injectable()
export class NjsStreamBanStore extends StreamBanStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

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
    streamBanStore: NjsStreamBanStore,
  ) {
    super(
      participantStore,
      botInstanceStore,
      events,
      userService,
      mediaService,
      streamBanStore,
    );
  }
}

@Controller()
export class ParticipantController implements OnStreamEnd, OnRoleChange {
  constructor(
    private store: NjsParticipantStore,
    private participant: NjsParticipantService,
  ) {}

  @MessagePattern('viewers.get')
  async onViewersRequest({
    stream,
    page,
  }: RequestViewers): Promise<RequestViewersResponse> {
    const viewers = await this.participant.getViewers(stream, page);

    return { viewers };
  }

  @MessagePattern('user.raise-hand')
  async onRaiseHand({ user, flag }: RequestRaiseHand) {
    await this.participant.setRaiseHand(user, flag);
  }

  @MessagePattern('participant.media-toggle')
  async onMediaToggle({
    user,
    audioEnabled,
    videoEnabled,
  }: RequestMediaToggle) {
    await this.participant.setMediaEnabled(user, {
      audioEnabled,
      videoEnabled,
    });
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    await this.participant.handleLeavingParticipant(user);
  }

  @OnEvent(EVENT_ROLE_CHANGE)
  async onRoleChange({ participant }) {
    return this.store.update(participant.id, participant);
  }

  @MessagePattern('participant.leave')
  async leave({ user }) {
    await this.participant.handleLeavingParticipant(user);
  }

  @MessagePattern('stream.kick-user')
  async onKickUser({ userToKick, user }: RequestKickUser) {
    await this.participant.kickStreamParticipant(userToKick, user);
  }

  /*
  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user, stream }) {
    await this.participant.removeUserFromStream(user, stream);
  }
    */

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    await this.participant.removeAllParticipantsFrom(stream);
  }
}

@Module({
  imports: [MediaModule, UserModule, BotInstanceModule, PrismaModule],
  providers: [NjsParticipantStore, NjsParticipantService, NjsStreamBanStore],
  controllers: [ParticipantController],
  exports: [NjsParticipantStore, NjsParticipantService],
})
@Global()
export class ParticipantModule {}
