import { PrismaClient, Stream as PrismaStream } from '@prisma/client';
import { Stream } from '@warpy/lib';

type CreateNewStream = PrismaStream;

export function toStreamDTO(data: PrismaStream): Stream {
  return {
    id: data.id,
    owner: data.owner_id,
    category: data.category,
    title: data.title,
    preview: data.preview,
  };
}

export class StreamStore {
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

  async findByIds(ids: string[]): Promise<Stream[]> {
    const data = await this.prisma.stream.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return data.map(toStreamDTO);
  }

  async findById(id: string): Promise<Stream | null> {
    const data = await this.prisma.stream.findUnique({
      where: {
        id,
      },
    });

    return data ? toStreamDTO(data) : null;
  }

  async create(data: CreateNewStream): Promise<Stream> {
    const stream = await this.prisma.stream.create({
      data,
    });

    return toStreamDTO(stream);
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
  }): Promise<Stream[]> {
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

  async setPreviewClip(stream: string, preview: string): Promise<Stream> {
    const updated = await this.prisma.stream.update({
      where: { id: stream },
      data: { preview },
    });

    return toStreamDTO(updated);
  }
}
