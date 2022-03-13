import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ListStoreBehaviour } from '@warpy-be/shared';
import IORedis from 'ioredis';

@Injectable()
export class BroadcastUserListStore implements OnModuleInit {
  redis: IORedis.Redis;
  lists: ListStoreBehaviour;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(
      this.configService.get('broadcastUserListStoreAddr'),
    );

    this.lists = new ListStoreBehaviour(this.redis, 'broadcast_list_');
  }

  async addUserToList(list: string, user: string) {
    return this.lists.addItem(list, user);
  }

  async removeUserFromList(list: string, user: string) {
    return this.lists.deleteItem(list, user);
  }

  async deleteList(list: string) {
    return this.lists.deleteList(list);
  }

  async get(list: string): Promise<string[]> {
    return this.lists.getItems(list) as Promise<string[]>;
  }
}
