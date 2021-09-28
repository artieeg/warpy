import { Invite, Stream, User } from "@prisma/client";
import { IInvite } from "@warpy/lib";
import { prisma, runPrismaQuery } from "./client";
import { toStreamDTO } from "./stream_dal";
import { toUserDTO } from "./user_dal";

export const toInviteDTO = (
  data: Invite & { invitee: User; inviter: User; stream: Stream }
): IInvite => {
  return {
    id: data.id,
    stream: toStreamDTO(data.stream),
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
          stream: true,
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
