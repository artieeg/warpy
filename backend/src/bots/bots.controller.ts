import { Body, Controller, Post } from '@nestjs/common';
import { CreateBotDTO } from './bots.dto';
import { BotsService } from './bots.service';

@Controller()
export class BotsController {
  constructor(private botsService: BotsService) {}

  @Post('/bot')
  async createNewBot(@Body() { name, botname, avatar, creator }: CreateBotDTO) {
    return this.botsService.createNewBot(name, botname, creator, avatar);
  }
}
