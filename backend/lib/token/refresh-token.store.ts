import { PrismaClient } from '@prisma/client';

export interface RefreshTokenStore {
  create: (token: string) => Promise<any>;
}

export class RefreshTokenStoreImpl {
  constructor(private prisma: PrismaClient) {}

  async create(token: string): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        token,
      },
    });
  }
}
