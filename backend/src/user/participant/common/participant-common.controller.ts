import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ILeaveStreamRequest, IMediaToggleRequest } from '@warpy/lib';
import { ParticipantCommonService } from './participant-common.service';

@Controller()
export class ParticipantCommonController {
  constructor(private participant: ParticipantCommonService) {}

  @MessagePattern('participant.leave')
  async onLeaveStream({ user }: ILeaveStreamRequest) {
    return this.participant.removeUserFromStream(user);
  }

  @MessagePattern('participant.media-toggle')
  async onMediaToggle({
    user,
    audioEnabled,
    videoEnabled,
  }: IMediaToggleRequest) {
    await this.participant.setMediaEnabled(user, {
      audioEnabled,
      videoEnabled,
    });
  }
}
