import { Module } from '@nestjs/common';
import { StreamModule } from '../stream/stream.module';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';

@Module({
  imports: [StreamModule],
  providers: [ReactionService],
  controllers: [ReactionController],
})
export class ReactionModule {}
