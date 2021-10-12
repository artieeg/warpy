import { Injectable } from '@nestjs/common';

@Injectable()
export class GifService {
  async getGifs(_page: number) {
    return [
      'https://c.tenor.com/OlI1GtD80I4AAAAC/laughing-funny-tom-and-jerry.gif',
    ];
  }
}
