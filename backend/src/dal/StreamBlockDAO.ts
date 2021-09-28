import { prisma, runPrismaQuery } from "./client";

export const StreamBlockDAO = {
  async create(stream: string, user: string) {
    await runPrismaQuery(() =>
      prisma.streamBlock.create({
        data: {
          stream_id: stream,
          user_id: user,
        },
      })
    );
  },

  async isBanned(user: string, stream: string) {
    const ban = await runPrismaQuery(() =>
      prisma.streamBlock.findFirst({
        where: {
          user_id: user,
          stream_id: stream,
        },
      })
    );

    return !!ban;
  },
};
