import { Injectable } from '@nestjs/common';
import { IUser } from '@warpy/lib';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(private user: UserEntity) {}

  async getById(user: string): Promise<IUser> {
    return this.user.findById(user, true);
  }
}
