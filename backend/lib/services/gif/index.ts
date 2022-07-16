import axios from 'axios';

export interface IGifService {
  searchGifs(
    search: string,
    next?: string,
  ): Promise<{
    gifs: string[];
    next: string;
  }>;
  getTrendingGifs(next?: string): Promise<{
    gifs: string[];
    next: string;
  }>;
}

export class GifService {
  constructor(private tenorAPIKey: string) {}

  async searchGifs(search: string, next?: string) {
    const pos = next ? `&pos=${next}` : '';

    const response = await axios.get(
      `https://g.tenor.com/v1/search?q="${search}"&key=${this.tenorAPIKey}&limit=50` +
        pos,
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
