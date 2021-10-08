import { ExceptionFilter } from '@backend_2/rpc-exception.filter';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IClap } from '@warpy/lib';
import { ReactionService } from './reaction.service';

@Controller()
export class ReactionController {
  constructor(private reactionService: ReactionService) {}

  @UseFilters(ExceptionFilter)
  @MessagePattern('stream.reaction')
  async onUserGet({ user, emoji, stream }: IClap) {
    await this.reactionService.countNewReaction(user, emoji, stream);
  }
}
