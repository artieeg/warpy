import { Injectable } from '@nestjs/common';
import { NjsUserOnlineStatusCache } from './user-online-status.cache';

@Injectable()
export class UserOnlineStatusService {
  constructor(private cache: NjsUserOnlineStatusCache) {}

  async setUserOnline(user: string) {
    await this.cache.setUserOnline(user);
  }

  async setUserOffline(user: string) {
    await this.cache.setUserOffline(user);
  }

  async getUserStatus(user: string): Promise<boolean> {
    return await this.cache.getUserStatus(user);
  }

  async getUserStatusMany(users: string[]): Promise<Record<string, boolean>> {
    const statuses = await this.cache.getUserStatusMany(users);

    const result = {};
    users.forEach((user, idx) => {
      result[user] = !!statuses[idx];
    });

    return result;
  }
}
