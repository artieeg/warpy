import { PrismaService } from '@backend_2/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AwardItem } from '@prisma/client';
import { IAwardModel } from '@warpy/lib';

@Injectable()
export class AwardModelEntity {
  constructor(private prisma: PrismaService) {}

  static toAwardModelDTO(data: AwardItem): IAwardModel {
    return {
      id: data.id,
      title: data.title,
      price: data.price,
      media: data.media,
    };
  }

  async getAvailableAwards() {
    const awards = await this.prisma.awardItem.findMany({});

    return awards.map(AwardModelEntity.toAwardModelDTO);
  }
}
