import {
  PrismaClient,
  StreamCategory as PrismaStreamCategory,
} from '@prisma/client';
import { StreamCategory } from '@warpy/lib';

function toStreamCategoryDTO(data: PrismaStreamCategory): StreamCategory {
  return {
    id: data.id,
    title: data.value,
  };
}

export class CategoryStore {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    const data = await this.prisma.streamCategory.findMany();

    return data
      .sort((a, b) => a.priority - b.priority)
      .map(toStreamCategoryDTO);
  }
}
