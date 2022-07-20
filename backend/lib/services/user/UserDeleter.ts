import { IUserStore } from 'lib';

export interface UserDeleter {
  del(user: string): Promise<void>;
}

export class UserDeleterImpl implements UserDeleter {
  constructor(private store: IUserStore) {}

  async del(user: string) {
    await this.store.del(user);
  }
}
