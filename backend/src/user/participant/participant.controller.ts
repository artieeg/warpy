import {
  OnParticipantLeave,
  OnStreamEnd,
  OnUserDisconnect,
} from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_KICKED,
  EVENT_STREAM_ENDED,
  EVENT_USER_DISCONNECTED,
} from '@warpy-be/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  IJoinStream,
  IJoinStreamResponse,
  ILeaveStreamRequest,
  IMediaToggleRequest,
  IRaiseHand,
  IRequestViewers,
  IRequestViewersResponse,
} from '@warpy/lib';
import { NjsParticipantService } from './participant.service';
import { NjsStreamJoiner } from './stream-joiner.service';

@Controller()
export class ParticipantController
  implements OnUserDisconnect, OnStreamEnd, OnParticipantLeave
{
  constructor(
    private participant: NjsParticipantService,
    private joiner: NjsStreamJoiner,
  ) {}

  @MessagePattern('viewers.get')
  async onViewersRequest({
    stream,
    page,
  }: IRequestViewers): Promise<IRequestViewersResponse> {
    const viewers = await this.participant.getViewers(stream, page);

    return { viewers };
  }

  @MessagePattern('user.raise-hand')
  async onRaiseHand({ user, flag }: IRaiseHand) {
    await this.participant.setRaiseHand(user, flag);
  }

  @MessagePattern('stream.join')
  async onNewViewer({
    stream,
    user,
  }: IJoinStream): Promise<IJoinStreamResponse> {
    return this.joiner.join(user, stream);
  }

  @MessagePattern('participant.leave')
  async onParticipantLeave({ user, stream }: ILeaveStreamRequest) {
    await this.participant.removeUserFromStream(user, stream);
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

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    await this.participant.handleLeavingParticipant(user);
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    await this.participant.removeAllParticipantsFrom(stream);
  }
}
