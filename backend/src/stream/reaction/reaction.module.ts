import { Module } from '@nestjs/common';
import { StreamCommonModule } from '../common/stream-common.module';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';

@Module({
  imports: [StreamCommonModule],
  providers: [ReactionService],
  controllers: [ReactionController],
})
export class ReactionModule {}
