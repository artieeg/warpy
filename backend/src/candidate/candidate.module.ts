import { Module } from '@nestjs/common';
import { StreamModule } from '../stream/stream.module';
import { BlockModule } from '../block/block.module';
import { ParticipantModule } from '../participant/participant.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';

@Module({
  imports: [PrismaModule, BlockModule, StreamModule, ParticipantModule],
  providers: [CandidateService],
  controllers: [CandidateController],
})
export class CandidateModule {}
