import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IInvite, IInviteBase, IStream, IUser } from '@warpy/lib';
import cuid from 'cuid';
import IORedis from 'ioredis';

/** Store user data */
const PREFIX_USER = 'user_';

/** Store stream data */
const PREFIX_STREAM = 'stream_';

/** Store invite data */
const PREFIX_INVITE = 'invite_';

/** Store invite ids from user */
const PREFIX_INVITES_FROM = 'invites_from';

@Injectable()
export class InviteStore implements OnModuleInit {
  private redis: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.configService.get('inviteStoreAddr'));
  }

  private toBaseDTO(data: any): IInviteBase {
    return {
      id: data.id,
      stream_id: data.stream_id,
      invitee_id: data.invitee_id,
      inviter_id: data.inviter_id,
    };
  }

  private toDTO(
    data: any,
    inviter: IUser,
    invitee: IUser,
    stream?: IStream,
  ): IInvite {
    return {
      ...this.toBaseDTO(data),
      stream,
      invitee,
      inviter,
    };
  }

  async create({
    invitee,
    inviter,
    stream,
  }: {
    invitee: IUser;
    inviter: IUser;
    stream?: IStream;
  }): Promise<IInvite> {
    const pipe = this.redis.pipeline();

    //Store invitee and inviter data
    pipe.hmset(PREFIX_USER + invitee.id, invitee);
    pipe.hmset(PREFIX_USER + inviter.id, inviter);

    //Store stream data if provided
    if (stream) {
      pipe.hmset(PREFIX_STREAM + stream.id, stream);
    }

    const invite_id = cuid();

    const invite: IInviteBase = {
      id: invite_id,
      inviter_id: inviter.id,
      invitee_id: invitee.id,
      stream_id: stream?.id,
    };

    //Store invite data
    pipe.hmset(PREFIX_INVITE + invite_id, invite);

    pipe.sadd(PREFIX_INVITES_FROM + inviter.id, invite_id);

    await pipe.exec();

    return this.toDTO(invite, inviter, invitee, stream);
  }

  private async getInviteBase(invite_id: string) {
    const data = await this.redis.hgetall(PREFIX_INVITE + invite_id);

    return this.toBaseDTO(data);
  }

  async get(invite_id: string) {
    const base = await this.getInviteBase(invite_id);

    const pipe = this.redis.pipeline();

    const { invitee_id, inviter_id, stream_id } = base;

    pipe.hgetall(PREFIX_USER + invitee_id);
    pipe.hgetall(PREFIX_USER + inviter_id);

    if (stream_id) {
      pipe.hgetall(PREFIX_STREAM + stream_id);
    }

    const data = await pipe.exec();

    const [invitee, inviter, stream] = data.map(([_err, v]) => v);

    return {
      ...base,
      invitee,
      inviter,
      stream,
    };
  }

  async getInvitedUsers(invite_ids: string[]) {
    const pipe = this.redis.pipeline();

    invite_ids.forEach((id) => {
      pipe.hget(PREFIX_INVITE + id, 'invitee_id');
    });

    const result = await pipe.exec();

    return result.filter(([err]) => !err).map(([, id]) => id);
  }

  async setStreamData(invite_ids: string[], stream: IStream) {
    const pipe = this.redis.pipeline();

    pipe.hmset(PREFIX_STREAM + stream.id, stream);
    invite_ids.forEach((invite_id) => {
      pipe.hset(PREFIX_INVITE + invite_id, 'stream_id', stream.id);
    });

    await pipe.exec();
  }

  /** Returns invite ids that the user has sent */
  async getUserInviteIds(user: string): Promise<string[]> {
    return this.redis.smembers(PREFIX_INVITES_FROM + user);
  }

  async del(invite_id: string) {
    const data = await this.getInviteBase(invite_id);

    const { inviter_id, invitee_id, stream_id } = data;

    const pipe = this.redis.pipeline();

    pipe.del(PREFIX_STREAM + stream_id);
    pipe.del(PREFIX_INVITE + invite_id);
    pipe.del(PREFIX_USER + invitee_id);
    pipe.del(PREFIX_USER + inviter_id);
    pipe.del(PREFIX_INVITES_FROM + inviter_id);

    await pipe.exec();

    return data;
  }
}
