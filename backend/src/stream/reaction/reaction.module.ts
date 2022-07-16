import { Module } from '@nestjs/common';
import { StreamCommonModule } from '../common/stream-common.module';
import { ReactionController } from './reaction.controller';
import { NjsReactionService } from './reaction.service';

@Module({
  imports: [StreamCommonModule],
  providers: [NjsReactionService],
  controllers: [ReactionController],
})
export class ReactionModule {}
