import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IActiveSpeakersPayload,
  IAllowSpeakerPayload,
  IJoinStream,
  IJoinStreamResponse,
  IKickUserRequest,
  ILeaveStreamRequest,
  IMediaToggleRequest,
  IRaiseHand,
  IRequestViewers,
  IRequestViewersResponse,
  ISetRoleRequest,
  IUserDisconnected,
} from '@warpy/lib';
import { ParticipantService } from './participant.service';

@Controller()
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

  @MessagePattern('user.disconnected')
  async onUserDisconnect({ user }: IUserDisconnected) {
    const isBot = user.slice(0, 3) === 'bot';

    if (isBot) {
      await this.participant.deleteBotParticipant(user);
    } else {
      await this.participant.deleteParticipant(user);
    }
  }

  @MessagePattern('viewers.get')
  async onViewersRequest({
    stream,
    page,
  }: IRequestViewers): Promise<IRequestViewersResponse> {
    const viewers = await this.participant.getViewers(stream, page);

    return { viewers };
  }

  @MessagePattern('participant.return-to-viewer')
  async onReturnToViewer({ user }: { user: string }) {
    await this.participant.returnToViewer(user);
  }

  @MessagePattern('user.raise-hand')
  async onRaiseHand({ user, flag }: IRaiseHand) {
    await this.participant.setRaiseHand(user, flag);
  }

  @MessagePattern('participant.set-permissions')
  async onSetPermissions() {}

  @MessagePattern('participant.set-role')
  async onSetRole({ user, userToUpdate, role }: ISetRoleRequest) {
    await this.participant.setRole(user, userToUpdate, role);
  }

  @MessagePattern('speaker.allow')
  async onNewSpeaker({ user, speaker }: IAllowSpeakerPayload) {
    await this.participant.allowSpeaker(user, speaker);
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
