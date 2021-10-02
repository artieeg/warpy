import { BannedFromStreamError } from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { StreamBlockEntity } from './stream-block.entity';

@Injectable()
export class StreamBlockService {
  constructor(private streamBlock: StreamBlockEntity) {}

  async checkUserBanned(user: string, stream: string) {
    const ban = await this.streamBlock.find(user, stream);

    if (ban) {
      throw new BannedFromStreamError('User is banned from this stream');
    }
  }
}
