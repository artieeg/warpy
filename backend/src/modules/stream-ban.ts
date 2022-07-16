import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StreamBanService, StreamBanStore } from 'lib';
import { PrismaModule, MediaModule } from '.';
import { IKickUserRequest } from '@warpy/lib';

@Injectable()
export class NjsStreamBanService extends StreamBanService {}

@Injectable()
export class NjsStreamBanStore extends StreamBanStore {}

@Controller()
export class ParticipantBanController {
  constructor(private ban: NjsStreamBanService) {}

  @MessagePattern('stream.kick-user')
  async onKickUser({ userToKick, user }: IKickUserRequest) {
    await this.ban.banUser(userToKick, user);
  }
}

@Module({
  imports: [PrismaModule, MediaModule],
  providers: [NjsStreamBanService, NjsStreamBanStore],
  controllers: [],
  exports: [NjsStreamBanService],
})
export class ParticipantBanModule {}
