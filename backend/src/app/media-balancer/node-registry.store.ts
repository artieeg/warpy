import { MediaServiceRole } from '@warpy/lib';
import IORedis from 'ioredis';

/** Stores arrays of online send/recv media nodes */
export class NodeRegistryStore {
  client: IORedis.Redis;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.client = new IORedis(this.uri);
  }

  private getSetNameFromRole(role: MediaServiceRole) {
    return role === 'CONSUMER' ? 'consumers' : 'producers';
  }

  async getNodeIds(role: MediaServiceRole): Promise<string[]> {
    const setOfNodes = this.getSetNameFromRole(role);

    return this.client.smembers(setOfNodes);
  }

  async addNewNode(node: string, role: MediaServiceRole) {
    const setOfNodes = this.getSetNameFromRole(role);

    await this.client.sadd(setOfNodes, node);
  }
}
