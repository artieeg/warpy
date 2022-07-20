import { Bot, BotInstance, PrismaClient } from '@prisma/client';
import { IUser } from '@warpy/lib';
import cuid from 'cuid';

export function toBotInstanceDTO(
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

export interface IBotInstanceStore {
  create(bot_id: string, stream_id: string): Promise<IUser>;
  getBotInstance(bot: string, stream: string): Promise<IUser>;
  getBotInstances(
    bot_id: string,
  ): Promise<{ botInstanceId: string; stream: string }[]>;
}

export class BotInstanceStore implements IBotInstanceStore {
  constructor(private prismaService: PrismaClient) {}

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

    return toBotInstanceDTO(data);
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

    return toBotInstanceDTO(data);
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
