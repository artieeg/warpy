import { AppInviteNotFound } from '@warpy-be/errors';
import { AppInvite, PrismaClient } from '@prisma/client';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { IAppInvite } from '@warpy/lib';
import { toUserDTO } from 'lib';

export interface IAppInviteStore {
  create(user_id: string): Promise<IAppInvite>;
  updateInviteCode(user_id: string): Promise<IAppInvite>;
  findByCode(code: string): Promise<{ id: string; user_id: string }>;
  findById(id: string): Promise<IAppInvite>;
  find(user_id: string): Promise<IAppInvite>;
}

export class AppInviteStore implements IAppInviteStore {
  constructor(private prisma: PrismaClient) {}

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
      user: toUserDTO(data.user),
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

    return AppInviteStore.toAppInviteDTO(invite);
  }

  async updateInviteCode(user_id: string) {
    const invite: AppInvite = await this.repeatUntilSuccess(() =>
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

    return AppInviteStore.toAppInviteDTO(invite);
  }

  /** Returns invite id */
  async findByCode(code: string) {
    try {
      const { id, user_id } = (
        await this.prisma.appInvite.findMany({
          where: {
            code: {
              equals: code,
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
            user_id: true,
          },
        })
      )[0];

      return { id, user_id };
    } catch (e) {
      throw new AppInviteNotFound();
    }
  }

  async findById(id: string) {
    return AppInviteStore.toAppInviteDTO(
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
    return AppInviteStore.toAppInviteDTO(
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
