import { User, UserBlock } from "@prisma/client";
import { IUserBlock } from "@warpy/lib";
import { prisma } from "./client";
import { toUserDTO } from "./user_dal";

export const toBlockDTO = (
  data: (UserBlock & { blocked?: User }) | null
): IUserBlock => {
  if (!data) {
    throw new Error("Block is null");
  }

  if (!data.blocked) {
    throw new Error("Blocked user data is null");
  }

  return {
    id: data.id,
    blocked: toUserDTO(data.blocked),
    blocker: data.blocker_id,
  };
};

export const BlockDAO = {
  async create({
    blocker,
    blocked,
  }: {
    blocker: string;
    blocked: string;
  }): Promise<string> {
    const { id } = await prisma.userBlock.create({
      data: {
        blocker_id: blocker,
        blocked_id: blocked,
      },
      select: {
        id: true,
      },
    });

    return id;
  },

  async deleteById(id: string) {
    await prisma.userBlock.delete({
      where: {
        id,
      },
    });
  },

  async getBlockedByIds(user: string): Promise<string[]> {
    const blocks = await prisma.userBlock.findMany({
      where: {
        blocked_id: user,
      },
      select: {
        blocker_id: true,
      },
    });

    return blocks.map((block) => block.blocker_id);
  },

  async getBlockedUsers(user: string): Promise<IUserBlock[]> {
    const blocks = await prisma.userBlock.findMany({
      where: {
        blocker_id: user,
      },
      include: {
        blocked: true,
      },
    });

    return blocks.map(toBlockDTO);
  },
};
