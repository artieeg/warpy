import { Injectable } from '@nestjs/common';
import { UserOnlineStatusCache } from './user-online-status.cache';

@Injectable()
export class UserOnlineStatusService {
  constructor(private cache: UserOnlineStatusCache) {}

  async setUserOnline(user: string) {
    await this.cache.setUserOnline(user);
  }

  async setUserOffline(user: string) {
    await this.cache.setUserOffline(user);
  }
}
