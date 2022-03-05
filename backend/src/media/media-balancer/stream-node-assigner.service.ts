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

  getAssignedNodes(stream: string) {
    return new Promise<string[]>((resolve, reject) => {
      this.client.smembers(stream, (err, values) => {
        if (err) reject(err);
        else resolve(values);
      });
    });
  }
}
