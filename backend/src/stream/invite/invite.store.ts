import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IInvite, IInviteBase, IStream, IUser } from '@warpy/lib';
import cuid from 'cuid';
import IORedis from 'ioredis';
import { StreamEntity } from '../common/stream.entity';

/** Store user data */
const PREFIX_USER = 'user_';

/** Store stream data */
const PREFIX_STREAM = 'stream_';

/** Store invite data */
const PREFIX_INVITE = 'invite_';

type InviteDTO = {
  id: string;
  stream?: string;
  inviter_id: string;
  invitee_id: string;
};

@Injectable()
export class InviteStore implements OnModuleInit {
  redis: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.configService.get('participantStoreAddr'));
  }

  private toBaseDTO(data: any): IInviteBase {
    return {
      id: data.id,
      stream_id: data.stream_id,
      invitee_id: data.invitee_id,
      inviter_id: data.inviter_id,
    };
  }

  private toDTO(data: any, inviter: IUser, invitee: IUser): IInvite {
    const stream = data.stream
      ? StreamEntity.toStreamDTO(data.stream_id)
      : undefined;

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

    await pipe.exec();

    return this.toDTO(invite, inviter, invitee);
  }

  private async getInviteBase(invite_id: string) {
    const data = await this.redis.hgetall(PREFIX_INVITE + invite_id);

    return this.toBaseDTO(data);
  }

  async del(invite_id: string) {
    const { inviter_id, invitee_id, stream_id } = await this.getInviteBase(
      invite_id,
    );

    const pipe = this.redis.pipeline();

    pipe.del(PREFIX_STREAM + stream_id);
    pipe.del(PREFIX_INVITE + invite_id);
    pipe.del(PREFIX_USER + invitee_id);
    pipe.del(PREFIX_USER + inviter_id);

    await pipe.exec();
  }
}
