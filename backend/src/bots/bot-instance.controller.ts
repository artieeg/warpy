import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IBotJoin } from '@warpy/lib';
import { BotInstanceService } from './bot-instance.service';

@Controller()
export class BotInstanceController {
  constructor(private botInstanceService: BotInstanceService) {}

  @MessagePattern('bot.join')
  async onBotJoin({ user, inviteDetailsToken }: IBotJoin) {
    const response = await this.botInstanceService.createBotInstance(
      user,
      inviteDetailsToken,
    );

    return response;
  }
}
