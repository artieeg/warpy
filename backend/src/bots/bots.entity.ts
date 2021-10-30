import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BotsEntity {
  constructor(private prismaService: PrismaService) {}

  async create(
    name: string,
    botname: string,
    avatar: string,
    creator: string,
  ) {}
}
