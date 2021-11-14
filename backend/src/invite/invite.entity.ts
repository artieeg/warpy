import { BotsEntity } from '@backend_2/bots/bots.entity';
import { PrismaService } from '@backend_2/prisma/prisma.service';
import { StreamEntity } from '@backend_2/stream/stream.entity';
import { UserEntity } from '@backend_2/user/user.entity';
import { Injectable } from '@nestjs/common';
import { Bot, Invite, Stream, User } from '@prisma/client';
import { IInvite } from '@warpy/lib';

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
      stream: StreamEntity.toStreamDTO(data.stream),
      invitee: data.user_invitee
        ? UserEntity.toUserDTO(data.user_invitee)
        : BotsEntity.toBotDTO(data.bot_invitee),
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

  async delete(invite_id: string, user: string) {
    const { id, notification, user_invitee_id, bot_invitee_id } =
      await this.prisma.invite.delete({
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

    return {
      id,
      invitee_id: user_invitee_id || bot_invitee_id,
      notification_id: notification?.id,
    };
  }
}
