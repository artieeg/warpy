import { UserNotFound } from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { IUser } from '@warpy/lib';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(private user: UserEntity) {}

  async getById(user: string): Promise<IUser> {
    const data = await this.user.findById(user, true);

    if (!data) {
      throw new UserNotFound();
    }

    return data;
  }
}
