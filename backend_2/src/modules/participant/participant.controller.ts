import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IJoinStream,
  IJoinStreamResponse,
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
}
