import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IUser } from '@warpy/lib';
import { NewUserParams, IUserStore } from 'lib/stores';

@Injectable()
export class NjsUserStore implements IUserStore {
  private store: IUserStore;

  update(user: string, data: Partial<User>) {
    return this.store.update(user, data);
  }

  async createAnonUser(): Promise<string> {
    return this.store.createAnonUser();
  }

  async createUser(data: NewUserParams): Promise<IUser> {
    return this.store.createUser(data);
  }

  async search(textToSearch: string): Promise<IUser[]> {
    return this.store.search(textToSearch);
  }

  async find(id: string, details = false): Promise<IUser | null> {
    return this.store.find(id, details);
  }

  async del(id: string): Promise<void> {
    return this.store.del(id);
  }

  async findMany(ids: string[]): Promise<IUser[]> {
    return this.store.findMany(ids);
  }
}
