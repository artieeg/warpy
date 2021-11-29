import { AppInviteNotFound } from '@backend_2/errors';
import { PrismaService } from '@backend_2/prisma/prisma.service';
import { UserEntity } from '@backend_2/user/user.entity';
import { Injectable } from '@nestjs/common';
import { AppInvite } from '@prisma/client';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { IAppInvite } from '../../../lib';

@Injectable()
export class AppInviteEntity {
  constructor(private prisma: PrismaService) {}

  private generateInviteCode() {
    return uniqueNamesGenerator({
      dictionaries: [colors, animals],
      separator: '',
      style: 'capital',
    });
  }

  private async repeatUntilSuccess(fn: any) {
    let attempts = 10;
    let success = false;
    let result: any;

    while (!success && attempts-- !== 0) {
      try {
        result = await fn();
        success = true;
      } catch (e) {}
    }

    return result;
  }

  static toAppInviteDTO(data: any): IAppInvite {
    return {
      id: data.id,
      user: UserEntity.toUserDTO(data.user),
      code: data.code,
    };
  }

  async create(user_id: string): Promise<IAppInvite> {
    const invite: AppInvite = await this.repeatUntilSuccess(() =>
      this.prisma.appInvite.create({
        data: {
          code: this.generateInviteCode(),
          user_id,
        },
        include: {
          user: true,
        },
      }),
    );

    return AppInviteEntity.toAppInviteDTO(invite);
  }

  async updateInviteCode(user_id: string) {
    await this.repeatUntilSuccess(() =>
      this.prisma.appInvite.update({
        where: {
          user_id,
        },
        data: {
          code: this.generateInviteCode(),
          user_id,
        },
      }),
    );
  }

  /** Returns invite id */
  async findByCode(code: string) {
    try {
      const { id } = await this.prisma.appInvite.findUnique({
        where: {
          code,
        },
      });

      return id;
    } catch (e) {
      throw new AppInviteNotFound();
    }
  }

  async findById(id: string) {
    return AppInviteEntity.toAppInviteDTO(
      await this.prisma.appInvite.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      }),
    );
  }

  async find(user_id: string) {
    return AppInviteEntity.toAppInviteDTO(
      await this.prisma.appInvite.findUnique({
        where: {
          user_id,
        },
        include: {
          user: true,
        },
      }),
    );
  }
}
