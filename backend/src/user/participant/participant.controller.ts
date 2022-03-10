import { OnStreamEnd, OnUserDisconnect } from '@backend_2/interfaces';
import { EVENT_STREAM_ENDED, EVENT_USER_DISCONNECTED } from '@backend_2/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { ILeaveStreamRequest, IMediaToggleRequest } from '@warpy/lib';
import { ParticipantService } from './participant.service';

@Controller()
export class ParticipantController implements OnUserDisconnect, OnStreamEnd {
  constructor(private participant: ParticipantService) {}

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
  async onUserDisconnect({ user }) {
    const isBot = user.slice(0, 3) === 'bot';

    if (isBot) {
      await this.participant.deleteBotParticipant(user);
    } else {
      await this.participant.deleteParticipant(user);
    }
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    await this.participant.clearStreamData(stream);
  }
}
