import { Injectable } from '@nestjs/common';
import { Stream } from '@prisma/client';
import { IStream } from '@warpy/lib';
import { PrismaService } from '../prisma/prisma.service';

type CreateNewStream = Omit<Stream, 'id'>;

@Injectable()
export class StreamEntity {
  constructor(private prisma: PrismaService) {}

  static toStreamDTO(data: Stream): IStream {
    return {
      id: data.id,
      owner: data.owner_id,
      hub: data.hub,
      title: data.title,
      preview: data.preview,
    };
  }

  async create(data: CreateNewStream): Promise<IStream> {
    const stream = await this.prisma.stream.create({
      data,
    });

    return StreamEntity.toStreamDTO(stream);
  }

  async findByOwnerIdLive(owner: string): Promise<IStream | null> {
    const stream = await this.prisma.stream.findFirst({
      where: {
        owner_id: owner,
        live: true,
      },
    });

    return stream ? StreamEntity.toStreamDTO(stream) : null;
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

  async delete(id: string): Promise<number> {
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

  async deleteByUser(user: string): Promise<number> {
    const result = await this.prisma.stream.deleteMany({
      where: { owner_id: user },
    });

    return result.count;
  }

  async get({
    blockedUserIds,
    blockedByUserIds,
  }: {
    blockedUserIds: string[];
    blockedByUserIds: string[];
  }): Promise<IStream[]> {
    const streams = await this.prisma.stream.findMany({
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
    });

    return streams.map(StreamEntity.toStreamDTO);
  }

  async setPreviewClip(stream: string, preview: string): Promise<IStream> {
    const updated = await this.prisma.stream.update({
      where: { id: stream },
      data: { preview },
    });

    return StreamEntity.toStreamDTO(updated);
  }
}
