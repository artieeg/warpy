import { PrismaService } from '@warpy-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Bot, BotInstance } from '@prisma/client';
import { IUser } from '@warpy/lib';
import cuid from 'cuid';

@Injectable()
export class BotInstanceEntity {
  constructor(private prismaService: PrismaService) {}

  static toBotInstanceDTO(
    data:
      | (BotInstance & {
          bot?: Bot;
        })
      | null,
  ): IUser {
    if (!data) {
      throw new Error('BotInstance is null');
    }

    return {
      id: data.id,
      last_name: data.bot.name,
      first_name: data.bot.name,
      username: data.bot.botname,
      avatar: data.bot.avatar,
      email: null,
      sub: null,
      isAnon: false,
    };
  }

  async create(bot_id: string, stream_id: string) {
    const data = await this.prismaService.botInstance.create({
      data: {
        bot_id,
        stream_id,
        id: 'bot_instance_' + cuid(),
      },
      include: {
        bot: true,
      },
    });

    return BotInstanceEntity.toBotInstanceDTO(data);
  }

  async getBotInstance(bot: string, stream: string) {
    const data = await this.prismaService.botInstance.findFirst({
      where: {
        bot_id: bot,
        stream_id: stream,
      },
      include: {
        bot: true,
      },
    });

    return BotInstanceEntity.toBotInstanceDTO(data);
  }

  async getBotInstances(bot_id: string) {
    const bots = await this.prismaService.botInstance.findMany({
      where: { bot_id },
    });

    return bots.map((bot) => ({
      botInstanceId: bot.id,
      stream: bot.stream_id,
    }));
  }
}
