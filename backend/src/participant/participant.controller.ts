import { ExceptionFilter } from '@backend_2/rpc-exception.filter';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IActiveSpeakersPayload,
  IKickUserRequest,
  ILeaveStreamRequest,
  IMediaToggleRequest,
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
