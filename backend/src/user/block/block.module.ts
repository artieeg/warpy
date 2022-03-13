import { ParticipantModule } from '@warpy-be/user/participant/participant.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { forwardRef, Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockEntity } from './block.entity';
import { BlockService } from './block.service';
import { BlockCacheService } from './block.cache';

@Module({
  imports: [PrismaModule, forwardRef(() => ParticipantModule)],
  providers: [BlockEntity, BlockCacheService, BlockService],
  exports: [BlockEntity, BlockService],
  controllers: [BlockController],
})
export class BlockModule {}
