import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Bot, BotInstance } from '@prisma/client';
import { IUser } from '@warpy/lib';

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
      id: data.bot_id,
      last_name: data.bot.name,
      first_name: data.bot.name,
      username: data.bot.botname,
      avatar: data.bot.avatar,
      email: null,
      sub: null,
    };
  }

  async create(bot_id: string) {
    const { id } = await this.prismaService.botInstance.create({
      data: {
        bot_id,
      },
      select: {
        id: true,
      },
    });

    return id;
  }
}