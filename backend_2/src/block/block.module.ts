import { forwardRef, Module } from '@nestjs/common';
import { ParticipantModule } from '../participant/participant.module';
import { PrismaModule } from '../prisma/prisma.module';
import { BlockEntity } from './block.entity';
import { BlockService } from './block.service';

@Module({
  imports: [PrismaModule, forwardRef(() => ParticipantModule)],
  providers: [BlockEntity, BlockService],
  exports: [BlockEntity, BlockService],
})
export class BlockModule {}
