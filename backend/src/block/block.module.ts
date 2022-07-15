import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { NjsBlockStore } from './block.entity';
import { NjsBlockService } from './block.service';
import { NjsBlockCacheStore } from './block.cache';
import { NjsStreamerIdStore } from './streamer_ids.store';

@Module({
  imports: [PrismaModule],
  providers: [
    NjsBlockStore,
    NjsBlockCacheStore,
    NjsStreamerIdStore,
    NjsBlockService,
  ],
  exports: [NjsBlockStore, NjsBlockService],
  controllers: [BlockController],
})
export class BlockModule {}
