import { Injectable, Controller, Post, Body, Module } from '@nestjs/common';
import { MediaModule } from './media';
import { TokenModule } from './token';
import { DeveloperAccountModule } from './developer-account';
import { BotsService, BotStore } from 'lib';
import { PrismaModule } from './prisma';

export type CreateBotDTO = {
  creator: string;
  name: string;
  botname: string;
  avatar: string;
};

@Injectable()
export class NjsBotsService extends BotsService {}

@Injectable()
export class NjsBotStore extends BotStore {}

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
