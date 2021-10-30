import { Injectable } from '@nestjs/common';

@Injectable()
export class BotsService {
  async createNewBot(
    name: string,
    botname: string,
    creator: string,
    avatar: string,
  ) {
    return 'bots otw';
  }
}
