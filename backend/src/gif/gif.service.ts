import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GifService {
  tenorAPIKey: string;

  constructor(configService: ConfigService) {
    this.tenorAPIKey = configService.get<string>('tenorAPIKey');
  }

  async getTrendingGifs(next?: string) {
    const pos = next ? `&pos=${next}` : '';

    const response = await axios.get(
      `https://g.tenor.com/v1/trending?key=${this.tenorAPIKey}&limit=50` + pos,
    );

    const { results, next: newNext } = response.data as any;

    return {
      gifs: results.map(({ media }) => {
        let { url } = media[0].tinygif;

        return url;
      }),
      next: newNext,
    };
  }
}
