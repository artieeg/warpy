import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class HostStore implements OnModuleInit {
  redis: Redis;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.config.get('streamHostAddr'));
  }

  async setStreamHost(host: string, stream: string) {
    await this.redis.set(host, stream);
  }

  async delStreamHost(host: string) {
    return this.redis.del(host);
  }

  async getStreamByHost(host: string) {
    const [, value] = await this.redis.get(host);

    return value as string;
  }
}
