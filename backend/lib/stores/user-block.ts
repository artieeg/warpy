import { UserBlock, User, PrismaClient } from '@prisma/client';
import { IUserBlock } from '@warpy/lib';
import { toUserDTO } from 'lib';

function toBlockDTO(data: (UserBlock & { blocked?: User }) | null): IUserBlock {
  if (!data) {
    throw new Error('Block is null');
  }

  if (!data.blocked) {
    throw new Error('Blocked user data is null');
  }

  return {
    id: data.id,
    blocked: toUserDTO(data.blocked),
    blocker: data.blocker_id,
  };
}

export interface IUserBlockStore {
  create({
    blocker,
    blocked,
  }: {
    blocker: string;
    blocked: string;
  }): Promise<string>;
  deleteByUsers(blocker_id: string, blocked_id: string): Promise<void>;
  getBlockedByIds(user: string): Promise<string[]>;
  getBlockedUserIds(user: string): Promise<string[]>;
  getBlockedUsers(user: string): Promise<IUserBlock[]>;
}

export class UserBlockStore implements IUserBlockStore {
  constructor(private prisma: PrismaClient) {}
  async create({
    blocker,
    blocked,
  }: {
    blocker: string;
    blocked: string;
  }): Promise<string> {
    const { id } = await this.prisma.userBlock.create({
      data: {
        blocker_id: blocker,
        blocked_id: blocked,
      },
      select: {
        id: true,
      },
    });

    return id;
  }

  async deleteByUsers(blocker_id: string, blocked_id: string) {
    await this.prisma.userBlock.delete({
      where: {
        blocked_index: {
          blocked_id,
          blocker_id,
        },
      },
    });
  }

  /**
   * Returns ids of the users, who blocked us
   */
  async getBlockedByIds(user: string): Promise<string[]> {
    const blocks = await this.prisma.userBlock.findMany({
      where: {
        blocked_id: user,
      },
      select: {
        blocker_id: true,
      },
    });

    return blocks.map((block) => block.blocker_id);
  }

  /**
   * Returns ids of users blocked by us
   */
  async getBlockedUserIds(user: string): Promise<string[]> {
    const blocks = await this.prisma.userBlock.findMany({
      where: {
        blocker_id: user,
      },
      select: {
        blocked_id: true,
      },
    });

    return blocks.map((block) => block.blocked_id);
  }

  /**
   * Returns blocks that are made by us
   */
  async getBlockedUsers(user: string): Promise<IUserBlock[]> {
    const blocks = await this.prisma.userBlock.findMany({
      where: {
        blocker_id: user,
      },
      include: {
        blocked: true,
      },
    });

    return blocks.map(toBlockDTO);
  }
}
