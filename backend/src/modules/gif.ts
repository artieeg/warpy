import { Injectable, Controller, Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { IGifsRequest, IGifsResponse } from '@warpy/lib';
import { MessagePattern } from '@nestjs/microservices';
import { GifService } from '@warpy-be/app';

@Injectable()
export class NjsGifService extends GifService {
  constructor(configService: ConfigService) {
    super(configService.get<string>('tenorAPIKey'));
  }
}

@Controller()
export class GifController {
  constructor(private gifService: NjsGifService) {}

  @MessagePattern('gifs.search')
  async searchGifs({ next, search }: IGifsRequest): Promise<IGifsResponse> {
    const { gifs, next: newNext } = await this.gifService.searchGifs(
      search,
      next,
    );

    return {
      gifs,
      next: newNext,
    };
  }

  @MessagePattern('gifs.trending')
  async getTrendingGifs({ next }: IGifsRequest): Promise<IGifsResponse> {
    const { gifs, next: newNext } = await this.gifService.getTrendingGifs(next);

    return {
      gifs,
      next: newNext,
    };
  }
}

@Module({
  imports: [ConfigModule],
  providers: [NjsGifService],
  controllers: [GifController],
  exports: [],
})
export class GifModule {}
