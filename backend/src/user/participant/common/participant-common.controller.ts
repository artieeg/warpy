import { EVENT_USER_DISCONNECTED } from '@backend_2/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
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

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }: { user: string }) {
    const isBot = user.slice(0, 3) === 'bot';

    if (isBot) {
      await this.participant.deleteBotParticipant(user);
    } else {
      await this.participant.deleteParticipant(user);
    }
  }
}
