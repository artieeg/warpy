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
import { getDayNumber } from '@warpy-be/utils/day';

const PREFIX_NOTIFICATION = 'noti_';
const PREFIX_USER = 'user_';
const PREFIX_STREAM = 'stream_';
const PREFIX_INVITE = 'invite_';

const PREFIX_NOTIFICATIONS_FOR_USER = 'noti_for_';
const PREFIX_NOTIFICATIONS_READ_BY = 'noti_read_by_';

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

    //Build indexes based on day eg notification ids for day 19124
    //For the next day we will have different day_n and
    //the previous index will be expired
    const day_n = getDayNumber();

    pipe.sadd(PREFIX_NOTIFICATIONS_FOR_USER + data.user_id + day_n, data.id);
    pipe.expire(PREFIX_NOTIFICATIONS_FOR_USER + data.user_id + day_n, 86400);

    await pipe.exec();

    return {
      ...data,
      invite,
    };
  }

  private async getAllIds(user: string) {
    return this.redis.smembers(PREFIX_NOTIFICATIONS_FOR_USER + user);
  }

  private async getUnreadIds(user: string) {
    return this.redis.sdiff(
      PREFIX_NOTIFICATIONS_FOR_USER + user,
      PREFIX_NOTIFICATIONS_READ_BY + user,
    );
  }

  private async fetchList(ids: string[]) {
    const notifications = await Promise.all(ids.map((id) => this.get(id)));

    return notifications;
  }

  async del(id: string, user: string) {
    const pipe = this.redis.pipeline();

    //Clear indexes, the data itself
    //will be expired within 24 hours
    //(see create* functions)
    pipe.srem(PREFIX_NOTIFICATIONS_READ_BY + user, id);
    pipe.srem(PREFIX_NOTIFICATIONS_FOR_USER + user, id);

    await pipe.exec();
  }

  async getUnread(user: string) {
    const unread_ids = await this.getUnreadIds(user);

    return this.fetchList(unread_ids);
  }

  async getAll(user: string) {
    const ids = await this.getAllIds(user);

    return this.fetchList(ids);
  }

  async readAll(user: string) {
    const day_n = getDayNumber();

    const unread_ids = await this.getUnreadIds(user);

    const pipe = this.redis.pipeline();

    unread_ids.forEach((id) =>
      pipe.sadd(PREFIX_NOTIFICATIONS_READ_BY + user + day_n, id),
    );

    pipe.expire(PREFIX_NOTIFICATIONS_READ_BY + user + day_n, 86400);

    await pipe.exec();
  }
}
