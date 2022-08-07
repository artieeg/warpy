import { Controller, Injectable, Module, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ReactionService } from '@warpy-be/app';
import { RequestPostReaction } from '@warpy/lib';
import { ExceptionFilter } from '../rpc-exception.filter';
import { NjsBroadcastService } from './broadcast';
import { NjsParticipantStore, ParticipantModule } from './participant';

@Injectable()
export class NjsReactionService extends ReactionService {
  constructor(
    broadcastService: NjsBroadcastService,
    participantService: NjsParticipantStore,
  ) {
    super(broadcastService, participantService);
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
  async onUserGet({ user, emoji, stream }: RequestPostReaction) {
    await this.reactionService.countNewReaction(user, emoji, stream);
  }
}

@Module({
  imports: [ParticipantModule],
  providers: [NjsReactionService],
  controllers: [ReactionController],
})
export class ReactionModule {}
