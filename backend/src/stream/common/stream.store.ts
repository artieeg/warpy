import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStream } from '@warpy/lib';
import IORedis from 'ioredis';

type NewStreamParams = {
  id: string;
  owner: string;
  title: string;
  category: string;
  preview: string;
};

@Injectable()
export class StreamStore implements OnModuleInit {
  private redis: IORedis.Redis;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.config.get('streamStoreAddr'));
  }

  static toStreamDTO(data: any): IStream {
    return {
      id: data.id,
      owner: data.owner_id,
      category: data.category,
      title: data.title,
      preview: data.preview,
    };
  }

  async create(data: NewStreamParams) {
    await this.redis.hmset(data.id, data);
  }
}
