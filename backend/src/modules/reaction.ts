import { Controller, Injectable, Module, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ReactionService } from '@warpy-be/app';
import { IClap } from '@warpy/lib';
import { ExceptionFilter } from '../rpc-exception.filter';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NjsReactionService extends ReactionService {
  constructor(events: EventEmitter2) {
    super(events);
  }

  onModuleInit() {
    this.onInstanceInit();
  }

  onModuleDestroy() {
    this.onInstanceDestroy();
  }
}

@Controller()
export class ReactionController {
  constructor(private reactionService: NjsReactionService) {}

  @UseFilters(ExceptionFilter)
  @MessagePattern('stream.reaction')
  async onUserGet({ user, emoji, stream }: IClap) {
    await this.reactionService.countNewReaction(user, emoji, stream);
  }
}

@Module({
  imports: [],
  providers: [NjsReactionService],
  controllers: [ReactionController],
})
export class ReactionModule {}
