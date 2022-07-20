import { IUser } from '@warpy/lib';
import { IUserStore } from 'lib/stores';

export interface UserSearcher {
  findById: (user: string, details?: boolean) => Promise<IUser>;
  search: (text: string, requester_id: string) => Promise<IUser[]>;
}

export class UserSearcherImpl implements UserSearcher {
  constructor(private store: IUserStore) {}

  async findById(user: string, details?: boolean) {
    return this.store.find(user, details);
  }

  async search(text: string, requester_id: string) {
    const users = await this.store.search(text);

    return users.filter((user) => user.id !== requester_id);
  }
}
