import { UserNotFound } from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { INewUser, INewUserResponse, IUser } from '@warpy/lib';
import { RefreshTokenEntity } from '../token/refresh-token.entity';
import { TokenService } from '../token/token.service';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private user: UserEntity,
    private tokenService: TokenService,
    private refreshTokenEntity: RefreshTokenEntity,
  ) {}

  async search(text: string): Promise<IUser[]> {
    return this.user.search(text);
  }

  async getById(user: string): Promise<IUser> {
    const data = await this.user.findById(user, true);

    if (!data) {
      throw new UserNotFound();
    }

    return data;
  }

  async createDevUser(data: INewUser): Promise<INewUserResponse> {
    const { username, avatar, last_name, first_name, email } = data;

    const user = await this.user.createNewUser({
      username,
      last_name,
      first_name,
      email,
      avatar,
      sub: 'DEV_ACCOUNT',
    });

    const accessToken = this.tokenService.createAuthToken(user.id, false, '1d');
    const refreshToken = this.tokenService.createAuthToken(
      user.id,
      false,
      '1y',
    );

    await this.refreshTokenEntity.create(refreshToken);

    return {
      id: user.id,
      access: accessToken,
      refresh: refreshToken,
    };
  }

  async deleteUser(user: string) {
    await this.user.delete(user);
  }
}
