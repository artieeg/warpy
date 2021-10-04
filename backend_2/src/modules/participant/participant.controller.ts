import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IJoinStream,
  IJoinStreamResponse,
  IRequestViewers,
  IUserDisconnected,
} from '@warpy/lib';
import { ParticipantService } from './participant.service';

@Controller()
export class ParticipantController {
  constructor(private participant: ParticipantService) {}

  @MessagePattern('stream.join')
  async createNewViewer({
    stream,
    user,
  }: IJoinStream): Promise<IJoinStreamResponse> {
    return this.participant.createNewViewer(stream, user);
  }

  @MessagePattern('user.disconnected')
  async onUserDisconnect({ user }: IUserDisconnected) {
    await this.participant.deleteParticipant(user);
  }

  @MessagePattern('viewers.get')
  async onViewersRequest({ stream, page }: IRequestViewers) {
    const viewers = await this.participant.getViewers(stream, page);

    return { viewers };
  }
}
