import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IActiveSpeakersPayload } from '@warpy/lib';
import { NjsActiveSpeakerService } from './active-speaker.service';

@Controller()
export class ActiveSpeakerController {
  constructor(private activeSpeakerService: NjsActiveSpeakerService) {}

  @MessagePattern('stream.active-speakers')
  async onActiveSpeakers({ speakers }: IActiveSpeakersPayload) {
    await this.activeSpeakerService.broadcastActiveSpeakers(speakers);
  }
}
