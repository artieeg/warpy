import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BotInstanceService, BotInstanceStore } from 'lib';
import { IBotJoin } from '@warpy/lib';
import { PrismaModule, PrismaService } from './prisma';
import { NjsMediaService } from './media';
import { NJTokenService } from './token';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NjsParticipantStore } from './participant';

@Injectable()
export class NjsBotInstanceStore extends BotInstanceStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsBotInstanceService extends BotInstanceService {
  constructor(
    media: NjsMediaService,
    token: NJTokenService,
    botInstanceStore: NjsBotInstanceStore,
    events: EventEmitter2,
    participantStore: NjsParticipantStore,
  ) {
    super(media, token, botInstanceStore, events, participantStore);
  }
}

@Controller()
export class BotInstanceController {
  constructor(private botInstanceService: NjsBotInstanceService) {}

  @MessagePattern('bot.join')
  async onBotJoin({ user, inviteDetailsToken }: IBotJoin) {
    const response = await this.botInstanceService.createBotInstance(
      user,
      inviteDetailsToken,
    );

    return response;
  }
}
@Module({
  imports: [PrismaModule],
  providers: [NjsBotInstanceService, NjsBotInstanceStore],
  controllers: [BotInstanceController],
  exports: [NjsBotInstanceService, NjsBotInstanceStore],
})
export class BotInstanceModule {}
