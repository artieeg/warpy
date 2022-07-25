import { Injectable, Controller } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StreamJoinerService } from '@warpy-be/app';
import {
  RequesJoinBot,
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
import { BotInstanceModule, NjsBotInstanceService } from './bot-instance';
import { NJTokenService, TokenModule } from './token';

@Injectable()
export class NjsStreamJoiner extends StreamJoinerService {
  constructor(
    participantService: NjsParticipantService,
    participantStore: NjsParticipantStore,
    events: EventEmitter2,
    mediaService: NjsMediaService,
    hostService: NjsHostService,
    botInstanceService: NjsBotInstanceService,
    tokenService: NJTokenService,
  ) {
    super(
      participantService,
      participantStore,
      botInstanceService,
      events,
      mediaService,
      hostService,
      tokenService,
    );
  }
}

@Controller()
export class StreamJoinerController {
  constructor(private joiner: NjsStreamJoiner) {}

  @MessagePattern('bot.join')
  async onBotJoin({ user, inviteDetailsToken }: RequesJoinBot) {
    const response = await this.joiner.joinBot(user, inviteDetailsToken);

    return response;
  }

  @MessagePattern('stream.join')
  async onNewViewer({
    stream,
    user,
  }: RequestJoinStream): Promise<JoinStreamResponse> {
    return this.joiner.join(user, stream);
  }
}

@Module({
  imports: [
    ParticipantModule,
    HostModule,
    MediaModule,
    BotInstanceModule,
    TokenModule,
  ],
  providers: [NjsStreamJoiner],
  controllers: [StreamJoinerController],
  exports: [],
})
export class StreamJoinerModule {}
