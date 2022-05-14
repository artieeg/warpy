import {
  OnNewStream,
  OnParticipantLeave,
  OnParticipantRejoin,
  OnStreamEnd,
  OnUserDisconnect,
} from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_KICKED,
  EVENT_PARTICIPANT_LEAVE,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_STREAM_CREATED,
  EVENT_STREAM_ENDED,
  EVENT_USER_DISCONNECTED,
} from '@warpy-be/utils';
import { Controller } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { ILeaveStreamRequest, IMediaToggleRequest } from '@warpy/lib';
import { ParticipantService } from './participant.service';

@Controller()
export class ParticipantController
  implements
    OnParticipantRejoin,
    OnUserDisconnect,
    OnStreamEnd,
    OnParticipantLeave
{
  constructor(
    private participant: ParticipantService,
    private eventEmitter: EventEmitter2,
  ) {}

  @MessagePattern('participant.leave')
  async onParticipantLeave({ user, stream }: ILeaveStreamRequest) {
    await this.participant.removeUserFromStream(user, stream);
    this.eventEmitter.emit(EVENT_PARTICIPANT_LEAVE, { user, stream });
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

  @OnEvent(EVENT_PARTICIPANT_KICKED)
  async onUserKicked({ user }) {
    await this.participant.removeUserFromStream(user);
  }

  @OnEvent(EVENT_PARTICIPANT_REJOIN)
  async onParticipantRejoin({ participant }) {
    await this.participant.activateUser(participant.id);
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    await this.participant.deactivateUser(user);
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    await this.participant.clearStreamData(stream);
  }
}
