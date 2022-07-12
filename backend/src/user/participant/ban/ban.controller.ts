import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IKickUserRequest } from '@warpy/lib';
import { NjsStreamBanService } from './ban.service';

@Controller()
export class ParticipantBanController {
  constructor(private ban: NjsStreamBanService) {}

  @MessagePattern('stream.kick-user')
  async onKickUser({ userToKick, user }: IKickUserRequest) {
    await this.ban.banUser(userToKick, user);
  }
}
