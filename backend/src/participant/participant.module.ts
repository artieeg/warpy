import { forwardRef, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BlockModule } from '../block/block.module';
import { BlockService } from '../block/block.service';
import { MediaModule } from '../media/media.module';
import { MessageModule } from '../message/message.module';
import { PrismaModule } from '../prisma/prisma.module';
import { StreamBlockModule } from '../stream-block/stream-block.module';
import { ParticipantController } from './participant.controller';
import { ParticipantEntity } from './participant.entity';
import { ParticipantService } from './participant.service';

@Module({
  imports: [
    PrismaModule,
    MediaModule,
    StreamBlockModule,
    forwardRef(() => BlockModule),
    MessageModule,
    //EventEmitterModule.forRoot(),
  ],
  providers: [ParticipantService, ParticipantEntity],
  controllers: [ParticipantController],
  exports: [ParticipantService, ParticipantEntity],
})
export class ParticipantModule {}
