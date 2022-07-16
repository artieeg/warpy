import { Injectable, Controller, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ActiveSpeakerService } from 'lib';
import { IActiveSpeakersPayload } from '@warpy/lib';

@Injectable()
export class NjsActiveSpeakerService extends ActiveSpeakerService {}

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
