import { ListStoreBehaviour } from '@warpy-be/shared';
import IORedis from 'ioredis';

export class BroadcastUserListStore {
  private redis: IORedis.Redis;
  private lists: ListStoreBehaviour;

  constructor(private uri: string) {}

  onInstanceInit() {
    this.redis = new IORedis(this.uri);

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
