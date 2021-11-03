import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Bot } from '@prisma/client';
import { IUser } from '@warpy/lib';
import cuid from 'cuid';

@Injectable()
export class BotsEntity {
  constructor(private prismaService: PrismaService) {}

  static toBotDTO(data: Bot): IUser {
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
    };
  }

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
}
