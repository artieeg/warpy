import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisClient, createClient } from 'redis';

@Injectable()
export class UserOnlineStatusCache implements OnModuleInit {
  client: RedisClient;

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
