import { prisma } from "./client";

export const RefreshTokenDAL = {
  async create(token: string): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        token,
      },
    });
  },
};
