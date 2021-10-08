import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefreshTokenEntity {
  constructor(private prisma: PrismaService) {}

  async create(token: string) {
    await this.prisma.refreshToken.create({
      data: {
        token,
      },
    });
  }
}
