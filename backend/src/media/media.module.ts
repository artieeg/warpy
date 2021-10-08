import { Module } from '@nestjs/common';
import { NatsModule } from '../nats/nats.module';
import { MediaCacheService } from './media.cache';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [NatsModule],
  providers: [MediaCacheService, MediaService],
  exports: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
