import { IUser } from '@warpy/lib';
import { UserStore } from 'lib/stores';

export interface UserSearcher {
  search: (text: string, requester_id: string) => Promise<IUser[]>;
}

export class UserSearcherImpl implements UserSearcher {
  constructor(private store: UserStore) {}

  async search(text: string, requester_id: string) {
    const users = await this.store.search(text);

    return users.filter((user) => user.id !== requester_id);
  }
}
