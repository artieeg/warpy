import { Injectable } from '@nestjs/common';
import { PreviousStreamCacheService } from './previous-stream.cache';

@Injectable()
export class PreviousStreamService {
  constructor(private previousStreamCache: PreviousStreamCacheService) {}

  async set(user: string, stream: string) {
    return this.previousStreamCache.set(user, stream);
  }

  async get(user: string) {
    return this.previousStreamCache.get(user);
  }

  async expire(user: string) {
    return this.previousStreamCache.expire(user);
  }
}
