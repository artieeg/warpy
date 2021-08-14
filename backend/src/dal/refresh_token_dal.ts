import { prisma } from "./client";

export const RefreshTokenDAL = {
  create: async (token: string) => {
    await prisma.refreshToken.create({
      data: {
        token,
      },
    });
  },
};
