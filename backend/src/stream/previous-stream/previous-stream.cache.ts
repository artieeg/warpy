import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient, createClient } from 'redis';

@Injectable()
export class PreviousStreamCacheService {
  client: RedisClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = createClient({
      url: this.configService.get('previousStreamCacheAddr'),
    });
  }

  async expire(user: string) {
    return new Promise<void>((resolve, reject) => {
      this.client.expire(user, 5 * 60, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async set(user: string, stream: string) {
    return new Promise<void>((resolve, reject) => {
      console.log({ user, stream });
      this.client.set(user, stream, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async get(user: string) {
    return new Promise<string | undefined>((resolve, reject) => {
      this.client.get(user, (err, value) => {
        if (err) reject(err);
        else resolve(value);
      });
    });
  }
}
