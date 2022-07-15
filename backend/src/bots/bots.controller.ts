import { Body, Controller, Post } from '@nestjs/common';
import { CreateBotDTO } from './bots.dto';
import { NjsBotsService } from './bots.service';

@Controller()
export class BotsController {
  constructor(private botsService: NjsBotsService) {}

  @Post('/bot')
  async createNewBot(@Body() { name, botname, avatar, creator }: CreateBotDTO) {
    return this.botsService.createNewBot(name, botname, creator, avatar);
  }
}
