import { PrismaService } from '@warpy-be/prisma/prisma.service';
import { UserEntity } from '@warpy-be/user/user.entity';
import { Injectable } from '@nestjs/common';
import { IAward } from '@warpy/lib';

@Injectable()
export class AwardEntity {
  constructor(private prisma: PrismaService) {}

  static toAwardDTO(data: any): IAward {
    return {
      id: data.id,
      sender: UserEntity.toUserDTO(data.sender),
      recipent: UserEntity.toUserDTO(data.recipent),
      visual: data.visual,
      message: data.message,
      created_at: data.created_at,
    };
  }

  async create(
    sender_id: string,
    recipent_id: string,
    visual: string,
    message: string,
  ) {
    const award = await this.prisma.award.create({
      data: {
        sender_id,
        recipent_id,
        message,
        visual,
      },
      include: {
        sender: true,
        recipent: true,
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
      },
    });

    return data.map(AwardEntity.toAwardDTO);
  }
}
