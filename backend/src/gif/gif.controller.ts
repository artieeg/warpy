import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IGifsRequest, IGifsResponse } from '@warpy/lib';
import { NjsGifService } from './gif.service';

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
