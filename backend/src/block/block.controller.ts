import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IUserBlockRequest, IUserBlockResponse } from '@warpy/lib';
import { BlockService } from './block.service';

@Controller()
export class BlockController {
  constructor(private blockService: BlockService) {}

  @MessagePattern('user.unblock')
  async onUserUnblock({
    user,
    userToBlock,
  }: IUserBlockRequest): Promise<IUserBlockResponse> {
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
