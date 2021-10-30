import { Body, Controller, Post } from '@nestjs/common';
import { CreateBotDTO } from './bots.dto';
import { BotsService } from './bots.service';

@Controller()
export class BotsController {
  constructor(private botsService: BotsService) {}

  @Post('/bot')
  async createNewBot(@Body() createBotDTO: CreateBotDTO) {
    return JSON.stringify(createBotDTO);
  }
}
