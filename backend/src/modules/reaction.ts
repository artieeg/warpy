import { Controller, Injectable, Module, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ReactionService } from 'lib';
import { IClap } from '@warpy/lib';
import { ExceptionFilter } from '../rpc-exception.filter';
import { StreamModule } from './stream';

@Injectable()
export class NjsReactionService extends ReactionService {
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
  imports: [StreamModule],
  providers: [NjsReactionService],
  controllers: [ReactionController],
})
export class ReactionModule {}
