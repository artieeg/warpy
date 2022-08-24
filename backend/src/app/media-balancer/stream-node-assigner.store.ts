import IORedis from 'ioredis';

/**
 * Stores arrays of nodes, where the stream "lives"
 * */
export class StreamNodeAssignerStore {
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
