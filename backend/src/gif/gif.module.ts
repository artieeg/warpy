import { Module } from '@nestjs/common';
import { GifController } from './gif.controller';
import { GifService } from './gif.service';

@Module({
  imports: [],
  providers: [GifService],
  controllers: [GifController],
  exports: [],
})
export class GifModule {}
