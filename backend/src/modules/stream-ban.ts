import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StreamBanService, StreamBanStore } from 'lib';
import { MediaModule } from './media';
import { IKickUserRequest } from '@warpy/lib';
import { NjsParticipantStore } from './participant';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaModule, PrismaService } from './prisma';

@Injectable()
export class NjsStreamBanStore extends StreamBanStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsStreamBanService extends StreamBanService {
  constructor(
    banStore: NjsStreamBanStore,
    participantStore: NjsParticipantStore,
    events: EventEmitter2,
  ) {
    super(banStore, participantStore, events);
  }
}

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
