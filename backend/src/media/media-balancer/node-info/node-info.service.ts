import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaServiceRole } from '@warpy/lib';
import IORedis from 'ioredis';

interface INodeInfo {
  node: string;
  load: number;
  role: MediaServiceRole;
}

@Injectable()
export class NodeInfoService implements OnModuleInit {
  client: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new IORedis(this.configService.get('mediaNodeInfo'));
  }

  async get(node: string): Promise<INodeInfo> {
    const data = await this.client.hgetall(node);

    return {
      role: data.role as MediaServiceRole,
      node: data.node,
      load: Number.parseFloat(data.load),
    };
  }

  set(node: string, data: INodeInfo) {
    const pipe = this.client.pipeline();

    pipe.hset(node, 'node', node, 'load', data.load, 'role', data.role);
    pipe.expire(node, 10);

    return pipe.exec();
  }
}
