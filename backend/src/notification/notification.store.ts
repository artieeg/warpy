import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';
import {
  IInvite,
  IInviteBase,
  INotification,
  INotificationBase,
} from '@warpy/lib';
import cuid from 'cuid';

const PREFIX_NOTIFICATION = 'noti_';
const PREFIX_USER = 'user_';
const PREFIX_STREAM = 'stream_';
const PREFIX_INVITE = 'invite_';

@Injectable()
export class NotificationStore implements OnModuleInit {
  private redis: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.configService.get('notificationStoreAddr'));
  }

  private async getInviteInfo(id: string): Promise<IInvite> {
    const invite_base = (await this.redis.hgetall(
      PREFIX_INVITE + id,
    )) as unknown as IInviteBase;

    const { invitee_id, inviter_id, stream_id } = invite_base;

    const pipe = this.redis.pipeline();

    pipe.hgetall(PREFIX_USER + invitee_id);
    pipe.hgetall(PREFIX_USER + inviter_id);
    pipe.hgetall(PREFIX_STREAM + stream_id);

    const [[, invitee], [, inviter], [, stream]] = await pipe.exec();

    return {
      ...invite_base,
      inviter,
      invitee,
      stream,
    };
  }

  async get(id: string): Promise<INotification> {
    const notification_base = (await this.redis.hgetall(
      PREFIX_NOTIFICATION + id,
    )) as unknown as INotificationBase;

    const { invite_id } = notification_base;

    const invite = invite_id ? await this.getInviteInfo(invite_id) : undefined;

    return {
      ...notification_base,
      invite,
    };
  }

  async createInviteNotification(invite: IInvite): Promise<INotification> {
    const { invitee, inviter, stream } = invite;

    const pipe = this.redis.pipeline();

    const DAY = 86400;

    pipe
      .hmset(PREFIX_USER + invitee.id, invitee)
      .expire(PREFIX_USER + invitee.id, DAY);

    pipe
      .hmset(PREFIX_USER + inviter.id, inviter)
      .expire(PREFIX_USER + inviter.id, DAY);

    pipe
      .hmset(PREFIX_STREAM + stream.id, stream)
      .expire(PREFIX_STREAM + stream.id, DAY);

    const invite_base: IInviteBase = {
      id: invite.id,
      inviter_id: invite.inviter.id,
      invitee_id: invite.invitee.id,
      stream_id: stream.id,
    };

    pipe
      .hmset(PREFIX_INVITE + invite.id, invite_base)
      .expire(PREFIX_INVITE + invite.id, DAY);

    const data: INotificationBase = {
      id: cuid(),
      hasBeenSeen: false,
      created_at: Date.now(),
      user_id: invitee.id,
      invite_id: invite.id,
    };

    pipe
      .hmset(PREFIX_NOTIFICATION + data.id)
      .expire(PREFIX_NOTIFICATION + data.id, DAY);

    return {
      ...data,
      invite,
    };
  }
}
