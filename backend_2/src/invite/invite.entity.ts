import { PrismaService } from '@backend_2/prisma/prisma.service';
import { StreamEntity } from '@backend_2/stream/stream.entity';
import { UserEntity } from '@backend_2/user/user.entity';
import { Injectable } from '@nestjs/common';
import { Invite, Stream, User } from '@prisma/client';
import { IInvite } from '@warpy/lib';

@Injectable()
export class InviteEntity {
  constructor(private prisma: PrismaService) {}

  static toInviteDTO(
    data: Invite & { invitee: User; inviter: User; stream: Stream },
  ): IInvite {
    return {
      id: data.id,
      stream: StreamEntity.toStreamDTO(data.stream),
      invitee: UserEntity.toUserDTO(data.invitee),
      inviter: UserEntity.toUserDTO(data.inviter),
    };
  }

  async create({
    invitee,
    inviter,
    stream,
  }: {
    invitee: string;
    inviter: string;
    stream: string;
  }): Promise<IInvite> {
    const invite = await this.prisma.invite.create({
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
    });

    return InviteEntity.toInviteDTO(invite);
  }

  async delete(invite_id: string, user: string) {
    const { id, notification, invitee_id } = await this.prisma.invite.delete({
      where: {
        inviter_index: {
          inviter_id: user,
          id: invite_id,
        },
      },
      include: {
        notification: {
          select: {
            id: true,
          },
        },
      },
    });

    return { id, invitee_id, notification_id: notification?.id };
  }
}
