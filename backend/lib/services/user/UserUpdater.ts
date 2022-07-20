import { IUser } from '@warpy/lib';
import { IUserStore } from 'lib/stores';

export interface UserUpdater {
  update: (user: string, params: Partial<IUser>) => Promise<void>;
}

export class UserUpdaterImpl {
  constructor(private store: IUserStore) {}

  async update(user: string, params: Partial<IUser>) {
    await this.store.update(user, params);
  }
}
