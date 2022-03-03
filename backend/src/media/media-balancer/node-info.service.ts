import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient, createClient } from 'redis';

interface INodeInfo {
  load: number;
}

@Injectable()
export class NodeInfoService implements OnModuleInit {
  client: RedisClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = createClient({
      url: this.configService.get('mediaNodeInfo'),
    });
  }

  write(node: string, data: INodeInfo) {
    console.log({ node, data });
    this.client.hset(node, 'load', data.load, () => {
      this.client.expire(node, 10);
    });
  }
}
