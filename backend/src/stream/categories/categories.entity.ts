import { PrismaService } from '@warpy-be/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { StreamCategory } from '@prisma/client';
import { IStreamCategory } from '@warpy/lib';

@Injectable()
export class CategoriesEntity {
  constructor(private prisma: PrismaService) {}

  static toStreamCategoryDTO(data: StreamCategory): IStreamCategory {
    return {
      id: data.id,
      title: data.value,
    };
  }

  async getAll() {
    const data = await this.prisma.streamCategory.findMany();

    return data
      .sort((a, b) => a.priority - b.priority)
      .map(CategoriesEntity.toStreamCategoryDTO);
  }
}
