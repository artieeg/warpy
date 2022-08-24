import { Injectable, Controller, Post, Body, Module } from '@nestjs/common';
import { MediaModule } from './media';
import { NJTokenService, TokenModule } from './token';
import {
  DeveloperAccountModule,
  NjsDeveloperAccountStore,
} from './developer-account';
import { BotsService, BotStore } from '@warpy-be/app';
import { PrismaModule, PrismaService } from './prisma';
import { NjsMessageService } from './message';

export type CreateBotDTO = {
  creator: string;
  name: string;
  botname: string;
  avatar: string;
};

@Injectable()
export class NjsBotStore extends BotStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsBotsService extends BotsService {
  constructor(
    botStore: NjsBotStore,
    developerAccountStore: NjsDeveloperAccountStore,
    messageService: NjsMessageService,
    tokenService: NJTokenService,
  ) {
    super(botStore, developerAccountStore, messageService, tokenService);
  }
}

@Controller()
export class BotController {
  constructor(private botsService: NjsBotsService) {}

  @Post('/bot')
  async createNewBot(@Body() { name, botname, avatar, creator }: CreateBotDTO) {
    return this.botsService.createNewBot(name, botname, creator, avatar);
  }
}

@Module({
  imports: [PrismaModule, MediaModule, DeveloperAccountModule, TokenModule],
  providers: [NjsBotsService, NjsBotStore],
  controllers: [BotController],
  exports: [NjsBotStore],
})
export class BotsModule {}
