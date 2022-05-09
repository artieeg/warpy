import { BotsEntity } from '@warpy-be/bots/bots.entity';
import { PrismaService } from '@warpy-be/prisma/prisma.service';
import { UserEntity } from '@warpy-be/user/user.entity';
import { Injectable } from '@nestjs/common';
import { Bot, Invite, Stream, User } from '@prisma/client';
import { IInvite } from '@warpy/lib';
import { StreamEntity } from '../common/stream.entity';

@Injectable()
export class InviteEntity {
  constructor(private prisma: PrismaService) {}

  static toInviteDTO(
    data: Invite & {
      user_invitee?: User;
      bot_invitee?: Bot;
      inviter: User;
      stream: Stream;
    },
  ): IInvite {
    return {
      id: data.id,
      stream: data.stream ? StreamEntity.toStreamDTO(data.stream) : null,
      invitee: data.user_invitee
        ? UserEntity.toUserDTO(data.user_invitee)
        : BotsEntity.toBotDTO(data.bot_invitee),
      inviter: UserEntity.toUserDTO(data.inviter),
    };
  }

  async deleteMany(inviter_id: string, stream_id: string) {
    return this.prisma.invite.deleteMany({
      where: {
        inviter_id,
        stream_id,
      },
    });
  }

  async setStreamId(inviter_id: string, stream_id: string) {
    return this.prisma.invite.updateMany({
      where: {
        inviter_id,
      },
      data: {
        stream_id,
      },
    });
  }

  async findUsersInvitedToDraftedStream(inviter_id: string) {
    const invites = await this.prisma.invite.findMany({
      where: {
        stream_id: null,
        inviter_id,
      },
      select: {
        user_invitee_id: true,
      },
    });

    return invites.map(({ user_invitee_id }) => user_invitee_id);
  }

  async create({
    invitee,
    inviter,
    stream,
  }: {
    invitee: string;
    inviter: string;
    stream?: string;
  }): Promise<IInvite> {
    const isBot = invitee.slice(0, 3) === 'bot';

    const invite = await this.prisma.invite.create({
      data: {
        user_invitee_id: isBot ? null : invitee,
        bot_invitee_id: isBot ? invitee : null,
        inviter_id: inviter,
        stream_id: stream,
      },
      include: {
        user_invitee: true,
        bot_invitee: true,
        inviter: true,
        stream: true,
      },
    });

    return InviteEntity.toInviteDTO(invite);
  }

  async deleteByInvitee(invite_id: string, invitee_id: string) {
    const { id, notification, inviter_id, user_invitee_id, bot_invitee_id } =
      await this.prisma.invite.delete({
        where: {
          invitee_index: {
            user_invitee_id: invitee_id,
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

    return {
      id,
      inviter_id,
      invitee_id: user_invitee_id || bot_invitee_id,
      notification_id: notification?.id,
    };
  }

  async deleteByInviter(invite_id: string, inviter_id: string) {
    const { id, notification, user_invitee_id, bot_invitee_id } =
      await this.prisma.invite.delete({
        where: {
          inviter_index: {
            inviter_id,
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

    return {
      id,
      inviter_id,
      invitee_id: user_invitee_id || bot_invitee_id,
      notification_id: notification?.id,
    };
  }
}
