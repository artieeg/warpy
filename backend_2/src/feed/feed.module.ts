import { Module } from '@nestjs/common';
import { StreamModule } from '../stream/stream.module';
import { BlockModule } from '../block/block.module';
import { ParticipantModule } from '../participant/participant.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [PrismaModule, BlockModule, StreamModule, ParticipantModule],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
