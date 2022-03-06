import { ParticipantModule } from '@backend_2/participant/participant.module';
import { PrismaModule } from '@backend_2/prisma/prisma.module';
import { forwardRef, Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockEntity } from './block.entity';
import { BlockService } from './block.service';

@Module({
  imports: [PrismaModule, forwardRef(() => ParticipantModule)],
  providers: [BlockEntity, BlockService],
  exports: [BlockEntity, BlockService],
  controllers: [BlockController],
})
export class BlockModule {}
