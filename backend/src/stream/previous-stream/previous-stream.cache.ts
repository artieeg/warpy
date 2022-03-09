import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Injectable()
export class PreviousStreamCacheService {
  client: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new IORedis(
      this.configService.get('previousStreamCacheAddr'),
    );
  }

  async expire(user: string) {
    return this.client.expire(user, 5 * 60);
  }

  async set(user: string, stream: string) {
    return this.client.set(user, stream);
  }

  async get(user: string) {
    return this.client.get(user);
  }
}
