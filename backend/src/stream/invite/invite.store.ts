import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BotsEntity } from '@warpy-be/bots/bots.entity';
import { UserEntity } from '@warpy-be/user/user.entity';
import { IInvite, IStream, IUser } from '@warpy/lib';
import cuid from 'cuid';
import IORedis from 'ioredis';
import { StreamEntity } from '../common/stream.entity';

const PREFIX_USER = 'user_';
const PREFIX_STREAM = 'stream_';
const PREFIX_INVITE = 'invite_';

@Injectable()
export class InviteStore implements OnModuleInit {
  redis: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.configService.get('participantStoreAddr'));
  }

  static toDTO(data: any, inviter: IUser, invitee: IUser): IInvite {
    return {
      id: data.id,
      stream: data.stream ? StreamEntity.toStreamDTO(data.stream) : null,
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
      pipe.hmset(PREFIX_INVITE + stream.id, stream);
    }

    const invite_id = cuid();

    //Store invite data
    pipe.hmset(PREFIX_INVITE + invite_id, {
      id: invite_id,
      inviter_id: inviter.id,
      invitee_id: invitee.id,
      stream: stream.id,
    });

    await pipe.exec();

    return {
      id: invite_id,
      stream: stream ?? null,
      invitee,
      inviter,
    };
  }
}
