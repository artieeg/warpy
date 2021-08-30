import { Stream } from "@prisma/client";
import { prisma } from "./client";

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
    owner: data.owner,
    hub: data.hub,
    title: data.title,
  };
};

export const StreamDAL = {
  createNewStream: async (data: CreateNewStream): Promise<IStream> => {
    const stream = await prisma.stream.create({
      data,
    });

    return toStreamDTO(stream);
  },

  findByOwnerIdLive: async (owner: string): Promise<IStream | null> => {
    const stream = await prisma.stream.findFirst({
      where: {
        owner,
        live: true,
      },
    });

    return stream ? toStreamDTO(stream) : null;
  },

  /**
   * Stops the stream, throws an error if no stream was updated
   */
  stopStream: async (id: string): Promise<void> => {
    await prisma.stream.updateMany({
      where: { id, live: true },
      data: { live: false },
    });
  },

  removeStreams: async (user: string): Promise<void> => {
    throw new Error("Unimplemented");
  },
};
