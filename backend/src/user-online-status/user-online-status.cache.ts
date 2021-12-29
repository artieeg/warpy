import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisClient, createClient } from 'redis';

@Injectable()
export class UserOnlineStatusCache implements OnModuleInit {
  client: RedisClient;

  getUserStatusMany(ids: string[]): Promise<(boolean | undefined)[]> {
    return new Promise<(boolean | undefined)[]>((resolve, reject) => {
      this.client.mget(ids, (err: any, values: boolean[]) => {
        if (err) reject(err);
        else resolve(values);
      });
    });
  }

  getUserStatus(user: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.client.get(user, (err: any, value?: boolean) => {
        if (err) reject(err);
        else resolve(!!value);
      });
    });
  }

  onModuleInit() {
    this.client = createClient({
      url: process.env.USER_ONLINE_STATUS,
    });
  }

  async setUserOnline(user: string) {
    return new Promise<void>((resolve, reject) => {
      this.client.set(user, true, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async setUserOffline(user: string) {
    return new Promise<void>((resolve, reject) => {
      this.client.del(user, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
