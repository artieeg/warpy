import { ExceptionFilter } from '@warpy-be/rpc-exception.filter';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IClap } from '@warpy/lib';
import { NjsReactionService } from './reaction.service';

@Controller()
export class ReactionController {
  constructor(private reactionService: NjsReactionService) {}

  @UseFilters(ExceptionFilter)
  @MessagePattern('stream.reaction')
  async onUserGet({ user, emoji, stream }: IClap) {
    await this.reactionService.countNewReaction(user, emoji, stream);
  }
}
