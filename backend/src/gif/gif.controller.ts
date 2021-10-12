import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IGifsRequest, IGifsResponse } from '@warpy/lib';
import { GifService } from './gif.service';

@Controller()
export class GifController {
  constructor(private gifService: GifService) {}

  @MessagePattern('gifs.get')
  async getGifs({ page }: IGifsRequest): Promise<IGifsResponse> {
    const gifs = await this.gifService.getGifs(page);

    return {
      gifs,
      page,
    };
  }
}
