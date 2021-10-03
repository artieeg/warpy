import { Module } from '@nestjs/common';
import { StreamModule } from '..';
import { BlockModule } from '../block/block.module';
import { ParticipantEntity } from '../participant/participant.entity';
import { ParticipantModule } from '../participant/participant.module';
import { PrismaModule } from '../prisma/prisma.module';
import { StreamEntity } from '../stream/stream.entity';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [PrismaModule, BlockModule, StreamModule, ParticipantModule],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
