import { Injectable, Controller } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StreamJoiner } from 'lib';
import { IJoinStream, IJoinStreamResponse } from '@warpy/lib';
import { NjsParticipantService, NjsParticipantStore } from './participant';
import { NjsStreamBanService, ParticipantBanModule } from './stream-ban';
import { NjsMediaService } from './media';
import { NjsHostService } from './stream-host';

@Injectable()
export class NjsStreamJoiner extends StreamJoiner {
  constructor(
    participantService: NjsParticipantService,
    participantStore: NjsParticipantStore,
    events: EventEmitter2,
    streamBansService: NjsStreamBanService,
    mediaService: NjsMediaService,
    hostService: NjsHostService,
  ) {
    super(
      participantService,
      participantStore,
      events,
      streamBansService,
      mediaService,
      hostService,
    );
  }
}

@Controller()
export class StreamJoinerController {
  constructor(private joiner: NjsStreamJoiner) {}
  @MessagePattern('stream.join')
  async onNewViewer({
    stream,
    user,
  }: IJoinStream): Promise<IJoinStreamResponse> {
    return this.joiner.join(user, stream);
  }
}

@Module({
  imports: [ParticipantBanModule],
  providers: [NjsStreamJoiner],
  controllers: [StreamJoinerController],
  exports: [],
})
export class StreamJoinerModule {}
