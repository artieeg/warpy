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
  OnParticipantKicked,
} from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_KICKED,
  EVENT_ROLE_CHANGE,
  EVENT_STREAM_ENDED,
  EVENT_USER_DISCONNECTED,
} from '@warpy-be/utils';
import {
  BotInstanceStore,
  ParticipantService,
  ParticipantStore,
} from '@warpy-be/app';
import {
  RequestViewers,
  RequestViewersResponse,
  RequestRaiseHand,
  RequestMediaToggle,
  Participant,
} from '@warpy/lib';
import { NjsUserService, UserModule } from './user';
import { PrismaModule, PrismaService } from './prisma';

@Injectable()
export class NjsBotInstanceStore extends BotInstanceStore {
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
  ) {
    super(participantStore, botInstanceStore, events, userService);
  }
}

@Controller()
export class ParticipantController
  implements OnStreamEnd, OnRoleChange, OnParticipantKicked
{
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

  @OnEvent(EVENT_PARTICIPANT_KICKED)
  async onParticipantKicked({ id: user, stream }: Participant) {
    await this.participant.removeUserFromStream(user, stream);
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

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    await this.participant.removeAllParticipantsFrom(stream);
  }
}

@Module({
  imports: [UserModule, PrismaModule],
  providers: [NjsParticipantStore, NjsBotInstanceStore, NjsParticipantService],
  controllers: [ParticipantController],
  exports: [NjsParticipantStore, NjsParticipantService],
})
@Global()
export class ParticipantModule {}
