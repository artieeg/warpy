import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IJoinStream,
  IJoinStreamResponse,
  IRaiseHand,
  IRequestViewers,
  IRequestViewersResponse,
  IUserDisconnected,
} from '@warpy/lib';
import { ParticipantService } from './participant.service';

@Controller()
export class ParticipantController {
  constructor(private participant: ParticipantService) {}

  @MessagePattern('stream.join')
  async onNewViewer({
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
  async onViewersRequest({
    stream,
    page,
  }: IRequestViewers): Promise<IRequestViewersResponse> {
    const viewers = await this.participant.getViewers(stream, page);

    return { viewers };
  }

  @MessagePattern('user.raise-hand')
  async onRaiseHand({ user }: IRaiseHand) {
    await this.participant.setRaiseHand(user, true);
  }
}
