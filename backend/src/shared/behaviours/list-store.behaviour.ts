import { Redis, Pipeline } from 'ioredis';

type Runner = Redis | Pipeline;

export class ListStoreBehaviour {
  constructor(private redis: Redis, private prefix: string) {}

  async addItem(list: string, item: string, runner: Runner = this.redis) {
    return runner.sadd(this.prefix + list, item);
  }

  async deleteItem(list: string, item: string, runner: Runner = this.redis) {
    return runner.srem(this.prefix + list, item);
  }

  async deleteList(list: string, runner: Runner = this.redis) {
    return runner.del(this.prefix + list);
  }

  async getItems(list: string, runner: Runner = this.redis) {
    return runner.smembers(this.prefix + list);
  }
}
