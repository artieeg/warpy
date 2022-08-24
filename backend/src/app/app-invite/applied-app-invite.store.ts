import { PrismaClient } from '@prisma/client';

export class AppliedAppInviteStore {
  constructor(private prisma: PrismaClient) {}

  async create(user_id: string, invite_id: string) {
    await this.prisma.appliedAppInvite.create({
      data: {
        user_id,
        invite_id,
      },
    });
  }

  async find(user_id: string) {
    try {
      const { id } = await this.prisma.appliedAppInvite.findUnique({
        where: {
          user_id,
        },
        select: {
          id: true,
        },
      });

      return id;
    } catch (e) {
      return undefined;
    }
  }
}
