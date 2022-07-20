import {
  OnlineStatusStoreBehavior,
  VAL_OFFLINE,
  VAL_ONLINE,
} from '@warpy-be/shared';
import IORedis from 'ioredis';
import { OnInstanceInit } from 'lib/OnInstanceInit.interface';

export interface IUserOnlineStatusStore extends OnInstanceInit {
  getUserStatusMany(ids: string[]): Promise<boolean[]>;
  getUserStatus(user: string): Promise<boolean>;
  setUserOnline(user: string): Promise<void>;
  setUserOffline(user: string): Promise<void>;
}

export class UserOnlineStatusStore implements IUserOnlineStatusStore {
  private client: IORedis.Redis;
  private onlineStatusStore: OnlineStatusStoreBehavior;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.client = new IORedis(this.uri);
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
