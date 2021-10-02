import { Module } from '@nestjs/common';
import { MediaCacheService } from './media.cache';
import { MediaService } from './media.service';

@Module({
  providers: [MediaCacheService, MediaService],
  exports: [MediaService],
})
export class MediaModule {}
