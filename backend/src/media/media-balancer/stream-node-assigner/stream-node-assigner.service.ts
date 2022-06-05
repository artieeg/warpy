import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

/**
 * Stores arrays of nodes, where the stream "lives"
 * */
@Injectable()
export class StreamNodeAssignerService implements OnModuleInit {
  client: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new IORedis(
      this.configService.get('mediaStreamNodeAssigner'),
    );
  }

  del(stream: string) {
    return this.client.del(stream);
  }

  assignNode(stream: string, node: string) {
    return this.client.sadd(stream, node);
  }

  getAssignedNodes(stream: string) {
    return this.client.smembers(stream);
  }
}
