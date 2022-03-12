import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Injectable()
export class UserOnlineStatusCache implements OnModuleInit {
  client: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new IORedis(this.configService.get('userOnlineStatusCache'));
  }

  async getUserStatusMany(ids: string[]): Promise<boolean[]> {
    const values = await this.client.mget(ids);

    return values.map((v) => !!v);
  }

  async getUserStatus(user: string) {
    const v = await this.client.get(user);

    return !!v;
  }

  async setUserOnline(user: string) {
    await this.client.set(user, 'true');
  }

  async setUserOffline(user: string) {
    await this.client.del(user);
  }
}
