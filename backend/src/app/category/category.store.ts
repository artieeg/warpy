import { PrismaClient, StreamCategory } from '@prisma/client';
import { IStreamCategory } from '@warpy/lib';

function toStreamCategoryDTO(data: StreamCategory): IStreamCategory {
  return {
    id: data.id,
    title: data.value,
  };
}

export class CategoryStore  {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    const data = await this.prisma.streamCategory.findMany();

    return data
      .sort((a, b) => a.priority - b.priority)
      .map(toStreamCategoryDTO);
  }
}
