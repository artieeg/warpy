import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Injectable()
export class StreamerIdStore implements OnModuleInit {
  private redis: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(
      this.configService.get('blockStreamerIdStoreAddr'),
    );
  }

  async get(stream: string) {
    return this.redis.smembers(stream);
  }

  async add(user: string, stream: string) {
    await this.redis.sadd(stream, user);
  }

  async rem(user: string, stream: string) {
    await this.redis.srem(stream, user);
  }

  async del(stream: string) {
    await this.redis.srem(stream);
  }
}
