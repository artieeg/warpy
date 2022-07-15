import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  OnParticipantLeave,
  OnRoleChange,
  OnStreamEnd,
} from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_LEAVE,
  EVENT_ROLE_CHANGE,
  EVENT_STREAM_ENDED,
} from '@warpy-be/utils';
import {
  IUserBlockRequest,
  IUserBlockResponse,
  IUserUnblockResponse,
} from '@warpy/lib';
import { NjsBlockService } from './block.service';
import { NjsStreamerIdStore } from './streamer_ids.store';

@Controller()
export class BlockController
  implements OnRoleChange, OnParticipantLeave, OnStreamEnd
{
  constructor(
    private blockService: NjsBlockService,
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
  }: IUserBlockRequest): Promise<IUserUnblockResponse> {
    await this.blockService.unblockUser(user, userToBlock);

    return {
      status: 'ok',
    };
  }

  @MessagePattern('user.block')
  async onUserBlock({
    user,
    userToBlock,
  }: IUserBlockRequest): Promise<IUserBlockResponse> {
    const blockId = await this.blockService.blockUser(user, userToBlock);

    return {
      blockId,
    };
  }
}
