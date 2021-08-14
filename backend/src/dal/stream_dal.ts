import { Stream } from "@prisma/client";
import { prisma } from "./client";

type CreateNewStream = Omit<Stream, "id">;

export const StreamDAL = {
  createNewStream: async (data: CreateNewStream): Promise<Stream> => {
    const stream = await prisma.stream.create({
      data,
    });

    return stream;
  },

  /**
   * Stops the stream, returns stopped stream id
   */
  stopStream: async (owner: string): Promise<string> => {
    const { id } = await prisma.stream.update({
      where: { live_index: { owner, live: true } },
      data: { live: false },
      select: { id: true },
    });

    return id;
  },
};
