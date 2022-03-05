import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient, createClient } from 'redis';
import { MediaServiceRole } from '@warpy/lib';

interface INodeInfo {
  load: number;
  role: MediaServiceRole;
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

  get(node: string) {
    return new Promise<INodeInfo>((resolve, reject) => {
      this.client.hgetall(node, (e, v) => {
        if (e) reject(e);
        else resolve(v);
      });
    });
  }

  set(node: string, data: INodeInfo) {
    console.log({ node, data });
    this.client.hset(node, 'load', data.load, 'role', data.role, () => {
      this.client.expire(node, 10);
    });
  }
}
