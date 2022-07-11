import { UserStore } from 'lib/stores';

export interface UserDeleter {
  del(user: string): Promise<void>;
}

export class UserDeleterImpl implements UserDeleter {
  constructor(private store: UserStore) {}

  async del(user: string) {
    await this.store.del(user);
  }
}
