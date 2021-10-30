import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BotsEntity {
  constructor(private prismaService: PrismaService) {}

  async create(
    name: string,
    botname: string,
    avatar: string,
    creator_id: string,
  ) {
    const { id } = await this.prismaService.bot.create({
      data: {
        name,
        botname,
        avatar,
        creator_id,
      },
    });

    return id;
  }
}
