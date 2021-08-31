import { prisma } from "./client";
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
  create: async (data: CreateNewStream): Promise<IStream> => {
    const stream = await prisma.stream.create({
      data,
    });

    return toStreamDTO(stream);
  },

  async findByOwnerIdLive(owner: string): Promise<IStream | null> {
    const stream = await prisma.stream.findFirst({
      where: {
        owner_id: owner,
        live: true,
      },
    });

    return stream ? toStreamDTO(stream) : null;
  },

  async delete(id: string): Promise<number> {
    const { count } = await prisma.stream.deleteMany({
      where: { id },
    });

    return count;
  },

  async deleteByUser(user: string): Promise<number> {
    const result = await prisma.stream.deleteMany({
      where: { owner_id: user },
    });

    return result.count;
  },

  async getAll(): Promise<IStream[]> {
    const streams = await prisma.stream.findMany();

    return streams.map(toStreamDTO);
  },

  async setPreviewClip(stream: string, preview: string): Promise<IStream> {
    const updated = await prisma.stream.update({
      where: { id: stream },
      data: { preview },
    });

    return toStreamDTO(updated);
  },
};
