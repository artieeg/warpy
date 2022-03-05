import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient, createClient } from 'redis';
import { MediaServiceRole } from '@warpy/lib';

interface INodeInfo {
  node: string;
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
    this.client.hset(
      node,
      'node',
      node,
      'load',
      data.load,
      'role',
      data.role,
      () => {
        this.client.expire(node, 10);
      },
    );
  }
}
