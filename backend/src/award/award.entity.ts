import { PrismaService } from '@backend_2/prisma/prisma.service';
import { UserEntity } from '@backend_2/user/user.entity';
import { Injectable } from '@nestjs/common';
import { IAward } from '@warpy/lib';
import { AwardModelEntity } from './award-model.entity';

@Injectable()
export class AwardEntity {
  constructor(private prisma: PrismaService) {}

  static toAwardDTO(data: any): IAward {
    return {
      id: data.id,
      sender: UserEntity.toUserDTO(data.sender),
      recipent: UserEntity.toUserDTO(data.recipent),
      award: AwardModelEntity.toAwardModelDTO(data.award),
      message: data.message,
      created_at: data.created_at,
    };
  }

  async create(
    sender_id: string,
    recipent_id: string,
    award_id: string,
    message: string,
  ) {
    const award = await this.prisma.award.create({
      data: {
        sender_id,
        recipent_id,
        message,
        award_id,
      },
      include: {
        sender: true,
        recipent: true,
        award: true,
      },
    });

    return AwardEntity.toAwardDTO(award);
  }

  async getByRecipent(id: string) {
    const data = await this.prisma.award.findMany({
      where: { recipent_id: id },
      include: {
        sender: true,
        recipent: true,
        award: true,
      },
    });

    return data.map(AwardEntity.toAwardDTO);
  }
}
