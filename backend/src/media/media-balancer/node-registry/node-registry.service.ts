import { RedisClient, createClient } from 'redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MediaServiceRole } from '@warpy/lib';
import { ConfigService } from '@nestjs/config';

@Injectable()
/** Stores arrays of online send/recv media nodes */
export class NodeRegistryService implements OnModuleInit {
  client: RedisClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = createClient({
      url: this.configService.get('mediaServerIdsCache'),
    });
  }

  private getSetNameFromRole(role: MediaServiceRole) {
    return role === 'CONSUMER' ? 'consumers' : 'producers';
  }

  async getNodeIds(role: MediaServiceRole): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const setOfNodes = this.getSetNameFromRole(role);

      this.client.smembers(setOfNodes, (err, ids) => {
        if (err) {
          return reject(err);
        }

        resolve(ids);
      });
    });
  }

  async addNewNode(node: string, role: MediaServiceRole) {
    const setOfNodes = this.getSetNameFromRole(role);

    this.client.sadd(setOfNodes, node);
  }
}
