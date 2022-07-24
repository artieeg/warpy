import { Bot, PrismaClient } from '@prisma/client';
import { User } from '@warpy/lib';
import cuid from 'cuid';

function toBotDTO(data: Bot): User {
  if (!data) {
    throw new Error('BotInstance is null');
  }

  return {
    id: data.id,
    last_name: data.name,
    first_name: data.name,
    username: data.botname,
    avatar: data.avatar,
    email: null,
    sub: null,
    isAnon: false,
  };
}

export class BotStore {
  constructor(private prismaService: PrismaClient) {}
  async create(
    name: string,
    botname: string,
    avatar: string,
    creator_id: string,
  ) {
    const { id } = await this.prismaService.bot.create({
      data: {
        id: `bot_${cuid()}`,
        name,
        botname,
        avatar,
        creator_id,
      },
    });

    return id;
  }

  async getMany(): Promise<User[]> {
    const bots = await this.prismaService.bot.findMany({});

    return bots.map(toBotDTO);
  }
}
