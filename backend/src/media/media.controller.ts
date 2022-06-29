import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnParticipantLeave } from '@warpy-be/interfaces';
import { EVENT_PARTICIPANT_LEAVE } from '@warpy-be/utils';
import { MediaService } from './media.service';

@Controller()
export class MediaController implements OnParticipantLeave {
  constructor(private mediaService: MediaService) {}

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user, stream }) {
    if (!stream) {
      return;
    }

    try {
      await this.mediaService.removeFromNodes({
        id: user,
        stream,
      });
    } catch (e) {}
  }
}
