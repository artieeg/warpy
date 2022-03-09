import { Injectable, OnModuleInit } from '@nestjs/common';
import { MediaServiceRole } from '@warpy/lib';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Injectable()
/** Stores arrays of online send/recv media nodes */
export class NodeRegistryService implements OnModuleInit {
  client: IORedis.Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new IORedis(this.configService.get('mediaServerIdsCache'));
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

    return this.client.sadd(setOfNodes, node);
  }
}
