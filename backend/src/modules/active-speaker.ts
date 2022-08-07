import { Injectable, Controller, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ActiveSpeakerService } from '@warpy-be/app';
import { RequestActiveSpeakers } from '@warpy/lib';
import { NjsBroadcastService } from './broadcast';
import { NjsParticipantStore, ParticipantModule } from './participant';

@Injectable()
export class NjsActiveSpeakerService extends ActiveSpeakerService {
  constructor(
    broadcastService: NjsBroadcastService,
    participantStore: NjsParticipantStore,
  ) {
    super(broadcastService, participantStore);
  }
}

@Controller()
export class ActiveSpeakerController {
  constructor(private activeSpeakerService: NjsActiveSpeakerService) {}

  @MessagePattern('stream.active-speakers')
  async onActiveSpeakers({ speakers }: RequestActiveSpeakers) {
    await this.activeSpeakerService.broadcastActiveSpeakers(speakers);
  }
}

@Module({
  imports: [ParticipantModule],
  providers: [NjsActiveSpeakerService],
  controllers: [ActiveSpeakerController],
  exports: [],
})
export class ActiveSpeakerModule {}
