import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IGifsRequest, IGifsResponse } from '@warpy/lib';
import { GifService } from './gif.service';

@Controller()
export class GifController {
  constructor(private gifService: GifService) {}

  @MessagePattern('gifs.get')
  async getGifs({ next }: IGifsRequest): Promise<IGifsResponse> {
    const { gifs, next: newNext } = await this.gifService.getTrendingGifs(next);

    return {
      gifs,
      next: newNext,
    };
  }
}
