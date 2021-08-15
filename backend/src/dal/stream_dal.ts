import { Stream } from "@prisma/client";
import { prisma } from "./client";

type CreateNewStream = Omit<Stream, "id">;

export interface IStream {
  id: string;
  owner: string;
  hub: string;
  title: string;
}

export const toStreamDTO = (data: any): IStream => {
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

  /**
   * Stops the stream, throws an error if no stream was updated
   */
  stopStream: async (owner: string): Promise<void> => {
    const result = await prisma.stream.updateMany({
      where: { owner, live: true },
      data: { live: false },
    });

    if (result.count === 0) {
      throw new Error();
    }
  },
};
