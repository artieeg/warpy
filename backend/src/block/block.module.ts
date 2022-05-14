import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockEntity } from './block.entity';
import { BlockService } from './block.service';
import { BlockCacheService } from './block.cache';
import { StreamerIdStore } from './streamer_ids.store';

@Module({
  imports: [PrismaModule],
  providers: [BlockEntity, BlockCacheService, StreamerIdStore, BlockService],
  exports: [BlockEntity, BlockService],
  controllers: [BlockController],
})
export class BlockModule {}
