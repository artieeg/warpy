import { Injectable, Controller } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StreamJoinerService } from '@warpy-be/app';
import {
  RequestJoinBot,
  RequestJoinStream,
  JoinStreamResponse,
} from '@warpy/lib';
import { NjsParticipantService, ParticipantModule } from './participant';
import { MediaModule, NjsMediaService } from './media';
import { HostModule, NjsHostService } from './stream-host';
import { NJTokenService, TokenModule } from './token';
import {
  NjsParticipantKickerService,
  ParticipantKickerModule,
} from './participant-kicker';

@Injectable()
export class NjsStreamJoiner extends StreamJoinerService {
  constructor(
    participantService: NjsParticipantService,
    mediaService: NjsMediaService,
    hostService: NjsHostService,
    tokenService: NJTokenService,
    participantKicker: NjsParticipantKickerService,
  ) {
    super(
      participantService,
      mediaService,
      hostService,
      tokenService,
      participantKicker,
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
