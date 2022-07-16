import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GifController } from './gif.controller';
import { NjsGifService } from './gif.service';

@Module({
  imports: [ConfigModule],
  providers: [NjsGifService],
  controllers: [GifController],
  exports: [],
})
export class GifModule {}
