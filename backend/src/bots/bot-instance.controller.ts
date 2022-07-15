import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IBotJoin } from '@warpy/lib';
import { NjsBotInstanceService } from './bot-instance.service';

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
