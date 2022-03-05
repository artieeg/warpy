import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient, createClient } from 'redis';

interface INodeInfo {
  load: number;
}

/**
 * Stores arrays of nodes, where the stream "lives"
 * */
@Injectable()
export class StreamNodeAssignerService implements OnModuleInit {
  client: RedisClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = createClient({
      url: this.configService.get('mediaStreamNodeAssigner'),
    });
  }

  assignNode(stream: string, node: string) {
    return new Promise<void>((resolve, reject) =>
      this.client.sadd(stream, node, (err: any) => {
        if (err) reject(err);
        else resolve();
      }),
    );
  }

  getAssignedNodes(stream: string) {
    return new Promise<string[]>((resolve, reject) => {
      this.client.smembers(stream, (err: any, values: any) => {
        if (err) reject(err);
        else resolve(values);
      });
    });
  }
}
