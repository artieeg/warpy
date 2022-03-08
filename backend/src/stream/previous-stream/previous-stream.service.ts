import { Injectable } from '@nestjs/common';
import { PreviousStreamCacheService } from './previous-stream.cache';

@Injectable()
export class PreviousStreamService {
  constructor(private previousStreamCache: PreviousStreamCacheService) {}

  async expire(user: string) {
    return this.previousStreamCache.expire(user);
  }
}
