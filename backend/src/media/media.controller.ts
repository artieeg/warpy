import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnParticipantKicked, OnParticipantLeave } from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_KICKED,
  EVENT_PARTICIPANT_LEAVE,
} from '@warpy-be/utils';
import { NjsMediaService } from './media.service';

@Controller()
export class MediaController
  implements OnParticipantLeave, OnParticipantKicked
{
  constructor(private mediaService: NjsMediaService) {}

  @OnEvent(EVENT_PARTICIPANT_KICKED)
  async onParticipantKicked({ id, stream }) {
    try {
      await this.mediaService.removeFromNodes({
        id,
        stream,
      });
    } catch (e) {}
  }

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
