import { PrismaClient } from '@prisma/client';

export class RefreshTokenStore {
  constructor(private prisma: PrismaClient) {}

  async create(token: string): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        token,
      },
    });
  }
}
