import { ExceptionFilter } from '@backend_2/rpc-exception.filter';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IActiveSpeakersPayload,
  IJoinStream,
  IJoinStreamResponse,
  IKickUserRequest,
  ILeaveStreamRequest,
  IMediaToggleRequest,
  IRaiseHand,
  IRequestViewers,
  IRequestViewersResponse,
  ISetRoleRequest,
} from '@warpy/lib';
import { ParticipantService } from './participant.service';

@Controller()
@UseFilters(ExceptionFilter)
export class ParticipantController {
  constructor(private participant: ParticipantService) {}

  @MessagePattern('participant.leave')
  async onLeaveStream({ user }: ILeaveStreamRequest) {
    return this.participant.removeUserFromStream(user);
  }

  @MessagePattern('stream.join')
  async onNewViewer({
    stream,
    user,
  }: IJoinStream): Promise<IJoinStreamResponse> {
    return this.participant.createNewViewer(stream, user);
  }

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

  @MessagePattern('participant.set-role')
  async onSetRole({ user, userToUpdate, role }: ISetRoleRequest) {
    await this.participant.setRole(user, userToUpdate, role);
  }

  @MessagePattern('stream.active-speakers')
  async onActiveSpeakers({ speakers }: IActiveSpeakersPayload) {
    await this.participant.broadcastActiveSpeakers(speakers);
  }

  @MessagePattern('stream.kick-user')
  async onKickUser({ userToKick, user }: IKickUserRequest) {
    await this.participant.kickUser(userToKick, user);
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
