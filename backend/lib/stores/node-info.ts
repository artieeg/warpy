import { MediaServiceRole } from '@warpy/lib';
import IORedis from 'ioredis';
import { OnInstanceInit } from 'lib/OnInstanceInit.interface';

interface INodeInfo {
  node: string;
  load: number;
  role: MediaServiceRole;
}

export interface INodeInfoStore extends OnInstanceInit {
  get(node: string): Promise<INodeInfo>;

  set(node: string, data: INodeInfo): Promise<void>;
}

export class NodeInfoStore implements INodeInfoStore {
  client: IORedis.Redis;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.client = new IORedis(this.uri);
  }

  async get(node: string): Promise<INodeInfo> {
    const data = await this.client.hgetall(node);

    return {
      role: data.role as MediaServiceRole,
      node: data.node,
      load: Number.parseFloat(data.load),
    };
  }

  async set(node: string, data: INodeInfo) {
    const pipe = this.client.pipeline();

    pipe.hset(node, 'node', node, 'load', data.load, 'role', data.role);
    pipe.expire(node, 10);

    await pipe.exec();
  }
}
