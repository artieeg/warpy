import { prisma, runPrismaQuery } from "./client";

export const RefreshTokenDAL = {
  async create(token: string): Promise<void> {
    await runPrismaQuery(() =>
      prisma.refreshToken.create({
        data: {
          token,
        },
      })
    );
  },
};
