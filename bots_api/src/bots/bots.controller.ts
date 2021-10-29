import { Controller, Post } from '@nestjs/common';
import { BotService } from './bots.service';

@Controller()
export class BotsController {
  constructor(private readonly botService: BotService) {}

  @Post('/bot')
  signUp(): string {
    return this.botService.createNewBot();
  }
}
