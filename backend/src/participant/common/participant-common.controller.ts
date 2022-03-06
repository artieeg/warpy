import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  ILeaveStreamRequest,
  ISetRoleRequest,
  IActiveSpeakersPayload,
  IKickUserRequest,
  IMediaToggleRequest,
} from '@warpy/lib';
import { ParticipantCommonService } from './participant-common.service';

@Controller()
export class ParticipantCommonController {
  constructor(private participant: ParticipantCommonService) {}

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
