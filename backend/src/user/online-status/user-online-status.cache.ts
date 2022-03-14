import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OnlineStatusStoreBehavior,
  VAL_OFFLINE,
  VAL_ONLINE,
} from '@warpy-be/shared';
import IORedis from 'ioredis';

@Injectable()
export class UserOnlineStatusCache implements OnModuleInit {
  client: IORedis.Redis;
  onlineStatusStore: OnlineStatusStoreBehavior;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new IORedis(this.configService.get('userOnlineStatusCache'));
    this.onlineStatusStore = new OnlineStatusStoreBehavior(this.client);
  }

  async getUserStatusMany(ids: string[]): Promise<boolean[]> {
    return this.onlineStatusStore.getStatusMany(ids);
  }

  async getUserStatus(user: string) {
    return this.onlineStatusStore.getStatus(user);
  }

  async setUserOnline(user: string) {
    return this.onlineStatusStore.set(user, VAL_ONLINE);
  }

  async setUserOffline(user: string) {
    return this.onlineStatusStore.set(user, VAL_OFFLINE);
  }
}
