import { MediaServiceRole } from '@warpy/lib';
import IORedis from 'ioredis';

interface NodeInfo {
  node: string;
  load: number;
  role: MediaServiceRole;
}
export class NodeInfoStore {
  client: IORedis.Redis;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.client = new IORedis(this.uri);
  }

  async get(node: string): Promise<NodeInfo> {
    const data = await this.client.hgetall(node);

    return {
      role: data.role as MediaServiceRole,
      node: data.node,
      load: Number.parseFloat(data.load),
    };
  }

  async set(node: string, data: NodeInfo) {
    const pipe = this.client.pipeline();

    pipe.hset(node, 'node', node, 'load', data.load, 'role', data.role);
    pipe.expire(node, 10);

    await pipe.exec();
  }
}
