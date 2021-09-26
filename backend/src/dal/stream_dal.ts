import { prisma, runPrismaQuery } from "./client";
import { Stream } from "@prisma/client";

type CreateNewStream = Omit<Stream, "id">;

export interface IStream {
  id: string;
  owner: string;
  hub: string;
  title: string;
}

export const toStreamDTO = (data: Stream): IStream => {
  return {
    id: data.id,
    owner: data.owner_id,
    hub: data.hub,
    title: data.title,
  };
};

export const StreamDAL = {
  async create(data: CreateNewStream): Promise<IStream> {
    const stream = await runPrismaQuery(() =>
      prisma.stream.create({
        data,
      })
    );

    return toStreamDTO(stream);
  },

  async findByOwnerIdLive(owner: string): Promise<IStream | null> {
    const stream = await runPrismaQuery(() =>
      prisma.stream.findFirst({
        where: {
          owner_id: owner,
          live: true,
        },
      })
    );

    return stream ? toStreamDTO(stream) : null;
  },

  async incReactionsCount(
    id: string,
    amount = 0
  ): Promise<{
    id: string;
    reactions: number;
  }> {
    const { reactions } = await runPrismaQuery(() =>
      prisma.stream.update({
        where: {
          id,
        },
        data: {
          reactions: {
            increment: amount,
          },
        },
        select: {
          reactions: true,
        },
      })
    );

    return { id, reactions };
  },

  async delete(id: string): Promise<number> {
    const { count } = await runPrismaQuery(() =>
      prisma.stream.deleteMany({
        where: { id },
      })
    );

    return count;
  },

  async stop(stream_id: string): Promise<void> {
    await runPrismaQuery(() =>
      prisma.stream.update({
        where: { id: stream_id },
        data: {
          live: false,
        },
      })
    );
  },

  async deleteByUser(user: string): Promise<number> {
    const result = await runPrismaQuery(() =>
      prisma.stream.deleteMany({
        where: { owner_id: user },
      })
    );

    return result.count;
  },

  async get({
    blockedUserIds,
    blockedByUserIds,
  }: {
    blockedUserIds: string[];
    blockedByUserIds: string[];
  }): Promise<IStream[]> {
    const streams = await runPrismaQuery(() =>
      prisma.stream.findMany({
        where: {
          live: true,
          AND: [
            {
              owner_id: {
                notIn: blockedUserIds, //The host should not be blocked
              },
            },
            {
              owner_id: {
                notIn: blockedByUserIds, //The host shouldn't have us blocked
              },
            },
          ],
        },
      })
    );

    return streams.map(toStreamDTO);
  },

  async setPreviewClip(stream: string, preview: string): Promise<IStream> {
    const updated = await runPrismaQuery(() =>
      prisma.stream.update({
        where: { id: stream },
        data: { preview },
      })
    );

    return toStreamDTO(updated);
  },
};
