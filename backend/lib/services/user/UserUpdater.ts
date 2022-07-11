import { IUser } from '@warpy/lib';
import { UserStore } from 'lib/stores';

export interface UserUpdater {
  update: (user: string, params: Partial<IUser>) => Promise<void>;
}

export class UserUpdaterImpl {
  constructor(private store: UserStore) {}

  async update(user: string, params: Partial<IUser>) {
    await this.store.update(user, params);
  }
}
