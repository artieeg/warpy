import IORedis from 'ioredis';
import { OnInstanceInit } from 'lib/OnInstanceInit.interface';

export interface IStreamNodeAssignerStore extends OnInstanceInit {
  del(stream: string): Promise<void>;
  assignNode(stream: string, node: string): Promise<void>;
  getAssignedNodes(stream: string): Promise<string[]>;
}

/**
 * Stores arrays of nodes, where the stream "lives"
 * */
export class StreamNodeAssignerStore implements IStreamNodeAssignerStore {
  client: IORedis.Redis;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.client = new IORedis(this.uri);
  }

  async del(stream: string) {
    await this.client.del(stream);
  }

  async assignNode(stream: string, node: string) {
    await this.client.sadd(stream, node);
  }

  async getAssignedNodes(stream: string) {
    return this.client.smembers(stream);
  }
}
