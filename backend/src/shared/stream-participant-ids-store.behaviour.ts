import { Redis, Pipeline } from 'ioredis';

type Runner = Redis | Pipeline;

export class MemberIdsStoreBehaviour {
  constructor(private redis: Redis, private prefix: string) {}

  async addMember(stream: string, user: string, runner: Runner = this.redis) {
    return runner.sadd(this.prefix + stream, user);
  }

  async deleteMember(
    stream: string,
    user: string,
    runner: Runner = this.redis,
  ) {
    return runner.srem(this.prefix + stream, user);
  }

  async deleteMembers(stream: string, runner: Runner = this.redis) {
    return runner.del(this.prefix + stream);
  }

  async getMembers(stream: string, runner: Runner = this.redis) {
    return runner.smembers(this.prefix + stream);
  }
}
