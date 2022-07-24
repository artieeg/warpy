import {
  OnlineStatusStoreBehavior,
  VAL_OFFLINE,
  VAL_ONLINE,
} from '@warpy-be/shared';
import IORedis from 'ioredis';

export class UserOnlineStatusStore {
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
