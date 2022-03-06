import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IActiveSpeakersPayload } from '@warpy/lib';
import { ActiveSpeakerService } from './active-speaker.service';

@Controller()
export class ActiveSpeakerController {
  constructor(private activeSpeakerService: ActiveSpeakerService) {}

  @MessagePattern('stream.active-speakers')
  async onActiveSpeakers({ speakers }: IActiveSpeakersPayload) {
    await this.activeSpeakerService.broadcastActiveSpeakers(speakers);
  }
}
