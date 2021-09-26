import { Invite, User } from "@prisma/client";
import { IInvite } from "@warpy/lib";
import { prisma, runPrismaQuery } from "./client";
import { toUserDTO } from "./user_dal";

export const toInviteDTO = (
  data: Invite & { invitee: User; inviter: User }
): IInvite => {
  return {
    stream: data.stream_id,
    invitee: toUserDTO(data.invitee),
    inviter: toUserDTO(data.inviter),
  };
};

export const InviteDAO = {
  async create({
    invitee,
    inviter,
    stream,
  }: {
    invitee: string;
    inviter: string;
    stream: string;
  }): Promise<IInvite> {
    const invite = await runPrismaQuery(() =>
      prisma.invite.create({
        data: {
          invitee_id: invitee,
          inviter_id: inviter,
          stream_id: stream,
        },
        include: {
          invitee: true,
          inviter: true,
        },
      })
    );

    return toInviteDTO(invite);
  },

  async delete(id: string, user: string): Promise<void> {
    await runPrismaQuery(() => {
      prisma.invite.deleteMany({
        where: {
          inviter_id: user,
          id,
        },
      });
    });
  },
};
