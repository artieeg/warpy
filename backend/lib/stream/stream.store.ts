import { PrismaClient, Stream } from '@prisma/client';
import { IStream } from '@warpy/lib';

type CreateNewStream = Stream;

export interface IStreamStore {
  setHost(stream: string, host: string): Promise<void>;
  search(text: string): Promise<IStream[]>;
  findByIds(ids: string[]): Promise<IStream[]>;
  findById(id: string): Promise<IStream | null>;
  create(data: CreateNewStream): Promise<IStream>;
  incReactionsCount(
    id: string,
    amount: number,
  ): Promise<{ id: string; reactions: number }>;
  delByHost(host: string): Promise<string | undefined>;
  del(id: string): Promise<number>;
  stop(stream_id: string): Promise<void>;
  delByUser(user: string): Promise<number>;
  find(params: {
    blockedUserIds: string[];
    blockedByUserIds: string[];
    category?: string;
  }): Promise<IStream[]>;
  setPreviewClip(stream: string, preview: string): Promise<IStream>;
}

export function toStreamDTO(data: Stream): IStream {
  return {
    id: data.id,
    owner: data.owner_id,
    category: data.category,
    title: data.title,
    preview: data.preview,
  };
}

export class StreamStore implements IStreamStore {
  constructor(private prisma: PrismaClient) {}

  async setHost(stream: string, host: string) {
    await this.prisma.stream.update({
      where: {
        id: stream,
      },
      data: {
        owner_id: host,
      },
    });
  }

  async search(text: string) {
    const streams = await this.prisma.stream.findMany({
      where: {
        title: {
          contains: text,
          mode: 'insensitive',
        },
      },
    });

    return streams.map((stream) => toStreamDTO(stream));
  }

  async findByIds(ids: string[]): Promise<IStream[]> {
    const data = await this.prisma.stream.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return data.map(toStreamDTO);
  }

  async findById(id: string): Promise<IStream | null> {
    const data = await this.prisma.stream.findUnique({
      where: {
        id,
      },
    });

    return data ? toStreamDTO(data) : null;
  }

  async create(data: CreateNewStream): Promise<IStream> {
    const stream = await this.prisma.stream.create({
      data,
    });

    return toStreamDTO(stream);
  }

  async incReactionsCount(
    id: string,
    amount = 0,
  ): Promise<{
    id: string;
    reactions: number;
  }> {
    const { reactions } = await this.prisma.stream.update({
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
    });

    return { id, reactions };
  }

  async delByHost(host: string): Promise<string | undefined> {
    const stream = await this.prisma.stream.findFirst({
      where: { owner_id: host },
    });

    if (!stream) {
      return undefined;
    }

    await this.prisma.stream.delete({
      where: { id: stream.id },
    });

    return stream.id;
  }

  async del(id: string): Promise<number> {
    const { count } = await this.prisma.stream.deleteMany({
      where: { id },
    });

    return count;
  }

  async stop(stream_id: string): Promise<void> {
    await this.prisma.stream.update({
      where: { id: stream_id },
      data: {
        live: false,
      },
    });
  }

  async delByUser(user: string): Promise<number> {
    const result = await this.prisma.stream.deleteMany({
      where: { owner_id: user },
    });

    return result.count;
  }

  async find({
    blockedUserIds,
    blockedByUserIds,
    category,
  }: {
    blockedUserIds: string[];
    blockedByUserIds: string[];
    category?: string;
  }): Promise<IStream[]> {
    const streams = await this.prisma.stream.findMany({
      where: {
        live: true,
        category,
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
    });

    return streams.map(toStreamDTO);
  }

  async setPreviewClip(stream: string, preview: string): Promise<IStream> {
    const updated = await this.prisma.stream.update({
      where: { id: stream },
      data: { preview },
    });

    return toStreamDTO(updated);
  }
}
