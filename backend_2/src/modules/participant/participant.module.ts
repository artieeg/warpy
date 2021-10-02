import { Module } from '@nestjs/common';
import { StreamModule } from '..';
import { MediaModule } from '../media/media.module';
import { PrismaModule } from '../prisma/prisma.module';
import { StreamBlockModule } from '../stream-block/stream-block.module';
import { ParticipantController } from './participant.controller';
import { ParticipantEntity } from './participant.entity';
import { ParticipantService } from './participant.service';

@Module({
  imports: [PrismaModule, StreamModule, MediaModule, StreamBlockModule],
  providers: [ParticipantService, ParticipantEntity],
  controllers: [ParticipantController],
})
export class ParticipantModule {}
