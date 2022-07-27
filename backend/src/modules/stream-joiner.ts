import { Injectable, Controller } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StreamJoinerService } from '@warpy-be/app';
import {
  RequestJoinBot,
  RequestJoinStream,
  JoinStreamResponse,
} from '@warpy/lib';
import {
  NjsParticipantService,
  NjsParticipantStore,
  ParticipantModule,
} from './participant';
import { MediaModule, NjsMediaService } from './media';
import { HostModule, NjsHostService } from './stream-host';
import { NJTokenService, TokenModule } from './token';
import {
  NjsParticipantKickerService,
  ParticipantKickerModule,
} from './participant-kicker';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NjsStreamJoiner extends StreamJoinerService {
  constructor(
    participantService: NjsParticipantService,
    participantStore: NjsParticipantStore,
    mediaService: NjsMediaService,
    hostService: NjsHostService,
    tokenService: NJTokenService,
    participantKicker: NjsParticipantKickerService,
    events: EventEmitter2,
  ) {
    super(
      participantService,
      participantStore,
      mediaService,
      hostService,
      tokenService,
      participantKicker,
      events,
    );
  }
}

@Controller()
export class StreamJoinerController {
  constructor(private joiner: NjsStreamJoiner) {}

  @MessagePattern('bot.join')
  async onBotJoin({ user, inviteDetailsToken }: RequestJoinBot) {
    const response = await this.joiner.joinBot(user, inviteDetailsToken);

    return response;
  }

  @MessagePattern('stream.join')
  async onNewViewer({
    stream,
    user,
  }: RequestJoinStream): Promise<JoinStreamResponse> {
    return this.joiner.joinUser(user, stream);
  }
}

@Module({
  imports: [
    ParticipantModule,
    HostModule,
    MediaModule,
    TokenModule,
    ParticipantKickerModule,
  ],
  providers: [NjsStreamJoiner],
  controllers: [StreamJoinerController],
  exports: [],
})
export class StreamJoinerModule {}
