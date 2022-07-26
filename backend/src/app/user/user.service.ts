import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_USER_CREATED } from '@warpy-be/utils';
import { RequestCreateUser, User } from '@warpy/lib';
import { RefreshTokenStore, TokenService } from '@warpy-be/app/token';
import { UserStore } from './user.store';
import { UserNotFound } from '@warpy-be/errors';

export class UserService {
  constructor(
    private store: UserStore,
    private token: TokenService,
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

  async createUser(data: RequestCreateUser) {
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

  async del(user: string) {
    await this.store.del(user);
  }

  async findById(user: string, details?: boolean) {
    const data = await this.store.find(user, details);

    if (!data) {
      throw new UserNotFound();
    }

    return data;
  }

  async search(text: string, requester_id: string) {
    const users = await this.store.search(text);

    return users.filter((user) => user.id !== requester_id);
  }

  async update(user: string, params: Partial<User>) {
    await this.store.update(user, params);
  }
}
