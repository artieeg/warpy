import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_USER_CREATED } from '@warpy-be/utils';
import { INewUser, INewUserResponse } from '@warpy/lib';
import { UserStore } from 'lib/stores';
import { RefreshTokenStore } from 'lib/stores/refresh-token';
import { Token } from '../token';

export interface UserCreator {
  createAnonUser: () => Promise<{ id: string; access: string }>;
  createUser: (data: INewUser) => Promise<INewUserResponse>;
}

export class UserCreatorImpl implements UserCreator {
  constructor(
    private store: UserStore,
    private token: Token,
    private refreshTokenStore: RefreshTokenStore,
    private events: EventEmitter2,
  ) {}

  async createAnonUser() {
    const anonUserId = await this.store.createAnonUser();

    const accessToken = this.token.createAuthToken(anonUserId, false, '1d');

    return {
      id: anonUserId,
      access: accessToken,
    };
  }

  async createUser(data: INewUser) {
    const { username, avatar, last_name, first_name, email } = data;

    const user = await this.store.createUser({
      username,
      last_name,
      first_name,
      email,
      avatar,
      sub: 'DEV_ACCOUNT',
      is_anon: false,
    });

    const accessToken = this.token.createAuthToken(user.id, false, '1d');
    const refreshToken = this.token.createAuthToken(user.id, false, '1y');

    this.events.emit(EVENT_USER_CREATED, {
      user,
    });

    await this.refreshTokenStore.create(refreshToken);

    return {
      id: user.id,
      access: accessToken,
      refresh: refreshToken,
    };
  }
}
