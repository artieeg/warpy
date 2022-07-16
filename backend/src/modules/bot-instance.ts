import { Controller, Injectable, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BotInstanceService, BotInstanceStore } from 'lib';
import { IBotJoin } from '@warpy/lib';
import { PrismaModule } from './prisma';

@Injectable()
export class NjsBotInstanceService extends BotInstanceService {}

@Injectable()
export class NjsBotInstanceStore extends BotInstanceStore {}

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
