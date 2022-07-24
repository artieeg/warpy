import { Injectable, Controller, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ActiveSpeakerService } from '@warpy-be/app';
import { IActiveSpeakersPayload } from '@warpy/lib';
import {EventEmitter2} from '@nestjs/event-emitter';

@Injectable()
export class NjsActiveSpeakerService extends ActiveSpeakerService {
  constructor(events: EventEmitter2) {
    super(events)
  }
}

@Controller()
export class ActiveSpeakerController {
  constructor(private activeSpeakerService: NjsActiveSpeakerService) {}

  @MessagePattern('stream.active-speakers')
  async onActiveSpeakers({ speakers }: IActiveSpeakersPayload) {
    await this.activeSpeakerService.broadcastActiveSpeakers(speakers);
  }
}

@Module({
  imports: [],
  providers: [NjsActiveSpeakerService],
  controllers: [ActiveSpeakerController],
  exports: [],
})
export class ActiveSpeakerModule {}
