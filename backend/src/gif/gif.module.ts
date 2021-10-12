import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GifController } from './gif.controller';
import { GifService } from './gif.service';

@Module({
  imports: [ConfigModule],
  providers: [GifService],
  controllers: [GifController],
  exports: [],
})
export class GifModule {}
