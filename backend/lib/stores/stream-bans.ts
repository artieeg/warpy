import { PrismaClient, StreamBlock } from '@prisma/client';

interface IBanDTO {
  user_id: string;
  id: string;
  stream_id: string;
}

function toBanDTO(data: StreamBlock): IBanDTO {
  return {
    user_id: data.user_id,
    id: data.id,
    stream_id: data.stream_id,
  };
}

export interface IStreamBanStore {
  create(stream: string, user: string): Promise<void>;
  find(user: string, stream: string): Promise<IBanDTO | null>;
}

export class StreamBanStore implements IStreamBanStore {
  constructor(private prisma: PrismaClient) {}
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

    return ban ? toBanDTO(ban) : null;
  }
}
