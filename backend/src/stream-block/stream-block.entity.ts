import { Injectable } from '@nestjs/common';
import { StreamBlock } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface IBanDTO {
  user_id: string;
  id: string;
  stream_id: string;
}

@Injectable()
export class StreamBlockEntity {
  constructor(private prisma: PrismaService) {}

  private toDTO(data: StreamBlock): IBanDTO {
    return {
      user_id: data.user_id,
      id: data.id,
      stream_id: data.stream_id,
    };
  }

  async create(stream: string, user: string) {
    await this.prisma.streamBlock.create({
      data: {
        stream_id: stream,
        user_id: user,
      },
    });
  }

  async find(user: string, stream: string): Promise<IBanDTO | null> {
    const ban = await this.prisma.streamBlock.findFirst({
      where: {
        user_id: user,
        stream_id: stream,
      },
    });

    return ban ? this.toDTO(ban) : null;
  }
}
