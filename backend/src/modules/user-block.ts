import { Injectable, Controller, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  OnRoleChange,
  OnParticipantLeave,
  OnStreamEnd,
} from '@warpy-be/interfaces';
import { PrismaModule, PrismaService } from './prisma';
import {
  EVENT_STREAM_ENDED,
  EVENT_PARTICIPANT_LEAVE,
  EVENT_ROLE_CHANGE,
} from '@warpy-be/utils';
import IORedis from 'ioredis';
import {
  UserBlockStore,
  UserBlockService,
  UserBlockCacheStore,
  StreamerIdStore,
} from '@warpy-be/app';
import {
  RequestBlockUser,
  UserUnblockResponse,
  UserBlockResponse,
} from '@warpy/lib';

@Injectable()
export class NjsStreamerIdStore extends StreamerIdStore {
  constructor(configService: ConfigService) {
    super(configService.get('blockStreamerIdStoreAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Injectable()
export class NjsUserBlockStore extends UserBlockStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsUserBlockCacheStore extends UserBlockCacheStore {
  client: IORedis.Redis;

  constructor(configService: ConfigService) {
    super(configService.get('blockCacheAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Injectable()
export class NjsUserBlockService extends UserBlockService {
  constructor(
    userBlockStore: NjsUserBlockStore,
    userBlockCache: NjsUserBlockCacheStore,
    streamerIdStore: NjsStreamerIdStore,
  ) {
    super(userBlockStore, userBlockCache, streamerIdStore);
  }
}

@Controller()
export class UserBlockController
  implements OnRoleChange, OnParticipantLeave, OnStreamEnd
{
  constructor(
    private blockService: NjsUserBlockService,
    private streamerIdStore: NjsStreamerIdStore,
  ) {}

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    return this.streamerIdStore.del(stream);
  }

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user, stream }) {
    return this.streamerIdStore.rem(user, stream);
  }

  @OnEvent(EVENT_ROLE_CHANGE)
  async onRoleChange({ participant }) {
    const { id, role, stream } = participant;

    if (role === 'streamer') {
      await this.streamerIdStore.add(id, stream);
    } else {
      await this.streamerIdStore.rem(id, stream);
    }
  }

  @MessagePattern('user.unblock')
  async onUserUnblock({
    user,
    userToBlock,
  }: RequestBlockUser): Promise<UserUnblockResponse> {
    await this.blockService.unblockUser(user, userToBlock);

    return {
      status: 'ok',
    };
  }

  @MessagePattern('user.block')
  async onUserBlock({
    user,
    userToBlock,
  }: RequestBlockUser): Promise<UserBlockResponse> {
    const blockId = await this.blockService.blockUser(user, userToBlock);

    return {
      blockId,
    };
  }
}

@Module({
  imports: [PrismaModule],
  providers: [
    NjsUserBlockStore,
    NjsUserBlockCacheStore,
    NjsStreamerIdStore,
    NjsUserBlockService,
  ],
  exports: [NjsUserBlockStore, NjsUserBlockService],
  controllers: [UserBlockController],
})
export class UserBlockModule {}
